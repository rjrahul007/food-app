import CustomHeader from "@/components/CustomHeader";
import { getCurrentUser } from "@/lib/appwrite.user";
import useAuthStore from "@/store/auth.store";
import { UserProfile } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const ProfileItem = ({ 
  icon, 
  label, 
  value, 
  onPress 
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity 
    className="flex-row items-center py-4"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-4 ">
      <Ionicons name={icon} size={20} color="#f97316" />
    </View>
    <View className="flex-1">
      <Text className="text-gray-500 text-sm mb-1">{label}</Text>
      <Text className="text-gray-900 font-medium text-base">
        {value || "Not provided"}
      </Text>
    </View>
    {onPress && (
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    )}
  </TouchableOpacity>
);

const Profile = () => {
  const { logout } = useAuthStore();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      if (userData) {
        setUser({
          name: userData.name,
          email: userData.email,
          accountid: userData.accountid,
          avatar: userData.avatar,
          phone: userData.phone,
          home_address: userData.home_address,
          office_address: userData.office_address,
          $id: userData.$id
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to load profile information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/sign-in");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout");
            }
          }
        }
      ]
    );
  };

  // Profile Information Items for FlatList
  const profileData = [
    { id: "1", icon: "person-outline", label: "Full Name", value: user?.name || "" },
    { id: "2", icon: "mail-outline", label: "Email", value: user?.email || "" },
    { id: "3", icon: "call-outline", label: "Phone number", value: user?.phone || "" },
    { id: "4", icon: "home-outline", label: "Address 1 - (Home)", value: user?.home_address || "" },
    { id: "5", icon: "business-outline", label: "Address 2 - (Work)", value: user?.office_address || "" },
  ];

  return (
    <SafeAreaView className="bg-white">
      <FlatList
        data={profileData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white shadow-sm border-top rounded-lg border-gray-100 px-4">
          <ProfileItem icon={item.icon as any} label={item.label} value={item.value} /></View>
        )}
      contentContainerClassName="pb-28 px-5 pt-5"
       ListHeaderComponent={() => (
        <View className="my-9">
          <CustomHeader title="Profile"/>
          <View className="items-center mb-4">
              <View className="relative mb-4">
                <Image
                  source={{
                    uri: user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff&size=120`
                  }}
                  className="w-28 h-28 rounded-full"
                />
                <TouchableOpacity 
                  className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full items-center justify-center border-2 border-white"
                  onPress={() => {
                    Alert.alert("Feature Coming Soon", "Avatar upload will be available soon!");
                  }}
                >
                  <Ionicons name="camera" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {user?.name || "User Name"}
              </Text>
              <Text className="text-gray-500">Welcome to FoodApp</Text>
            </View>
          </View>)}
        ListFooterComponent={
            <>
            {/* Action Buttons */}
            <View className="space-y-4 my-8">
              <TouchableOpacity
                className="bg-orange-50 border border-orange-200 rounded-full py-3 px-6"
                onPress={handleEditProfile}
              >
                <Text className="text-primary font-semibold text-center text-md">
                  Edit Profile
                </Text>
              </TouchableOpacity>
                                   
              <TouchableOpacity
                className="bg-red-50 border border-red-200 rounded-full py-3 px-6 mt-4 flex-row items-center justify-center"
                onPress={handleLogout}
              >
                <SimpleLineIcons name="logout" size={18} color="#dc2626" />
                <Text className="text-red-600 font-semibold text-md ml-2">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
        
            {/* Additional Options */}
            <View className="bg-white rounded-lg shadow-sm border border-gray-50 p-4 mb-6">
              <TouchableOpacity 
                className="flex-row items-center py-4 border-b border-gray-100"
                onPress={() => Alert.alert("Feature Coming Soon", "Order history will be available soon!")}
              >
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="receipt-outline" size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium text-base">Order History</Text>
                  <Text className="text-gray-500 text-sm">View your past orders</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center py-4 border-b border-gray-100"
                onPress={() => Alert.alert("Feature Coming Soon", "Favorites will be available soon!")}
              >
                <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="heart-outline" size={20} color="#ec4899" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium text-base">Favorites</Text>
                  <Text className="text-gray-500 text-sm">Your favorite dishes</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center py-4"
                onPress={() => Alert.alert("Feature Coming Soon", "Settings will be available soon!")}
              >
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="settings-outline" size={20} color="#6b7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium text-base">Settings</Text>
                  <Text className="text-gray-500 text-sm">App preferences</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </>
        }
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchUserProfile} />}
      />

      {/* Overlay Loader */}
      {loading && (
        <View className="absolute inset-0 bg-white/60 justify-center items-center z-50">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="mt-4 text-gray-500">Loading profile...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Profile;
