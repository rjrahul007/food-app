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
  keyboardType = "default"
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) => (
  <View className="mb-6">
    <Text className="text-gray-700 font-medium mb-2 text-base">{label}</Text>
    <TextInput
      className={`border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base ${
        multiline ? "h-20" : "h-12"
      }`}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      keyboardType={keyboardType}
    />
  </View>
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

  const fetchUserProfile = async () => {
    try {
      const userData = await getCurrentUser();
      setLoading(true);
      if (!userData) {
        Alert.alert("Error", "User not found");
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
      Alert.alert("Error", "Failed to load profile information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    // Validate required fields
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Name is required");
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert("Validation Error", "Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

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
        "Success",
        "Profile updated successfully!",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
          >
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900">Edit Profile</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="mt-4 text-gray-500">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-900">Edit Profile</Text>
      </View>

      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <InputField
            label="Full Name *"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            placeholder="Enter your full name"
          />

          <InputField
            label="Email Address *"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <InputField
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <InputField
            label="Home Address"
            value={formData.homeAddress}
            onChangeText={(text) => setFormData({...formData, homeAddress: text})}
            placeholder="Enter your home address"
            multiline
          />

          <InputField
            label="Work Address"
            value={formData.workAddress}
            onChangeText={(text) => setFormData({...formData, workAddress: text})}
            placeholder="Enter your work address"
            multiline
          />

          <Text className="text-sm text-gray-500 mb-6">
            * Required fields
          </Text>
        </ScrollView>

        {/* Save Button */}
        <View className="px-5 pb-5 pt-2 border-t border-gray-100">
          <TouchableOpacity
            className={`rounded-xl py-4 px-6 ${
              saving ? "bg-orange-300" : "bg-orange-500"
            }`}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Saving...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-center text-lg">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;