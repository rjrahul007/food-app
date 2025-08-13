import { getCurrentUser, updateUserProfile } from "@/lib/appwrite.user";
import { UserProfile } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = "default",
  required = false,
  icon,
  maxlength
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  required?: boolean;
  icon?: string;
  maxlength?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-5">
      <View className="flex-row items-center mb-2">
        {icon && (
          <Ionicons 
            name={icon as any} 
            size={16} 
            color="#6B7280" 
            style={{ marginRight: 6 }}
          />
        )}
        <Text className="text-gray-700 font-semibold text-sm">
          {label}{required && <Text className="text-red-500"> *</Text>}
        </Text>
      </View>
      
      <TextInput
        className={`border-2 rounded-2xl px-4 py-3 text-gray-900 text-base bg-white ${
          isFocused 
            ? "border-orange-400" 
            : value 
              ? "border-green-300" 
              : "border-gray-200"
        } ${multiline ? "min-h-[80px]" : "h-14"}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCorrect={false}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
      />
      
      {required && !value.trim() && (
        <Text className="text-red-500 text-xs mt-1 ml-1">
          This field is required
        </Text>
      )}
    </View>
  );
};

const LoadingScreen = () => (
  <SafeAreaView className="flex-1 bg-gray-50">
    <View className="bg-white shadow-sm">
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 p-2 -ml-2 rounded-full"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Edit Profile</Text>
      </View>
    </View>
    
    <View className="flex-1 justify-center items-center">
      <View className="bg-white rounded-3xl p-8 shadow-lg">
        <ActivityIndicator size="large" color="#EA580C" />
        <Text className="mt-4 text-gray-600 font-medium text-center">
          Loading your profile...
        </Text>
        <Text className="text-gray-500 text-sm text-center mt-1">
          This won't take long
        </Text>
      </View>
    </View>
  </SafeAreaView>
);

const EditProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    homeAddress: "",
    workAddress: ""
  });

  // Calculate form completion percentage
  const getCompletionPercentage = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field.trim().length > 0);
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const fetchUserProfile = async () => {
    try {
      const userData = await getCurrentUser();
      if (!userData) {
        Alert.alert("Error", "User not found", [
          { text: "OK", onPress: () => router.back() }
        ]);
        return;
      }
      
      const userProfile: UserProfile = {
        $id: userData.$id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        home_address: userData.homeAddress,
        office_address: userData.workAddress,
        accountid: userData.accountid,
      };
      
      setUser(userProfile);
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        homeAddress: userProfile.home_address || "",
        workAddress: userProfile.office_address || ""
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert(
        "Connection Error", 
        "Failed to load profile information. Please check your connection and try again.",
        [
          { text: "Retry", onPress: fetchUserProfile },
          { text: "Cancel", onPress: () => router.back() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Please enter your full name");
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert("Validation Error", "Please enter your email address");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!user || !validateForm()) return;

    try {
      setSaving(true);
      await updateUserProfile(user.$id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        home_address: formData.homeAddress.trim(),
        office_address: formData.workAddress.trim()
      });
      Alert.alert(
        "Success! 🎉",
        "Your profile has been updated successfully.",
        [
          {
            text: "Great!",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Update Failed", 
        "We couldn't save your changes. Please check your connection and try again.",
        [
          { text: "Retry", onPress: handleSave },
          { text: "Cancel" }
        ]
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1  mt-6">
      {/* Enhanced Header */}
      <View className="">
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 -ml-2 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Edit Profile</Text>
          </View>
          
          {/* Progress indicator */}
          <View className="bg-orange-100 px-3 py-1.5 rounded-full">
            <Text className="text-orange-600 text-xs font-bold">
              {getCompletionPercentage()}% complete
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
        >
          {/* Welcome section */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Update Your Information
            </Text>
            <Text className="text-gray-600 text-base leading-relaxed">
              Keep your profile current to ensure we can provide you with the best personalized experience.
            </Text>
          </View>

          {/* Essential Information */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center mb-6">
              <View className="bg-orange-100 p-3 rounded-2xl mr-4">
                <Ionicons name="person" size={24} color="#EA580C" />
              </View>
              <View>
                <Text className="text-xl font-bold text-gray-900">
                  Personal Details
                </Text>
                <Text className="text-gray-600 text-sm">
                  Basic information about you
                </Text>
              </View>
            </View>
            
            <InputField
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Enter your complete name"
              required
              icon="person-outline"
            />
            
            <InputField
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              required
              icon="mail-outline"
            />
            
            <InputField
              label="Mobile Number"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              placeholder="987-4563-214"
              keyboardType="phone-pad"
              maxlength={10}
              icon="call-outline"
            />
          </View>

          {/* Address Information */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center mb-6">
              <View className="bg-blue-100 p-3 rounded-2xl mr-4">
                <Ionicons name="location" size={24} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-xl font-bold text-gray-900">
                  Address Information
                </Text>
                <Text className="text-gray-600 text-sm">
                  Where can we reach you?
                </Text>
              </View>
            </View>
            
            <InputField
              label="Home Address"
              value={formData.homeAddress}
              onChangeText={(text) => setFormData({...formData, homeAddress: text})}
              placeholder="123 Main Street, City, State, ZIP"
              multiline
              icon="home-outline"
            />
            
            <InputField
              label="Work Address"
              value={formData.workAddress}
              onChangeText={(text) => setFormData({...formData, workAddress: text})}
              placeholder="456 Business Ave, City, State, ZIP"
              multiline
              icon="business-outline"
            />
          </View>

          {/* Help section */}
          <View className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-100">
            <View className="flex-row items-start">
              <Ionicons 
                name="information-circle-outline" 
                size={24} 
                color="#EA580C" 
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View className="flex-1">
                <Text className="text-orange-900 font-bold text-base mb-2">
                  Quick Tips
                </Text>
                <Text className="text-orange-800 text-sm leading-relaxed">
                  • Required fields help us verify your identity{'\n'}
                  • Address information enables location-based features{'\n'}
                  • All data is encrypted and secure
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Enhanced floating save button */}
        <View className="absolute bottom-0 left-0 right-0">
          <View className="bg-white/95 backdrop-blur-sm border-t border-gray-100 px-6 py-4">
            <TouchableOpacity
              className={`rounded-2xl py-4 px-6 shadow-lg ${
                saving 
                  ? "bg-orange-400" 
                  : "bg-gradient-to-r from-orange-500 to-orange-600 bg-orange-500"
              }`}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold text-lg ml-3">
                    Saving Changes...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center justify-center">
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Save Profile
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            <Text className="text-center text-gray-500 text-xs mt-2">
              Your changes will be saved securely
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;