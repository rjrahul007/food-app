import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { Redirect, Slot, usePathname } from "expo-router";
import React from "react";
import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export default function AuthLayout() {
  const {isAuthenticated} = useAuthStore()
  const pathname = usePathname();
  const backgroundImage =
  pathname.includes("sign-up")
    ? images.burgerTwo 
    : images.loginGraphic;
  if(isAuthenticated) return <Redirect href={'/'}/>
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
            <View className="w-rull relative" style={{height: Dimensions.get('screen').height/2.25}}>
                <ImageBackground source={backgroundImage} className="size-full rounded-b-lg" resizeMode="stretch"/>
                <Image source={images.logo} className="self-center size-48 absolute -bottom-16 z-10" resizeMode="contain" />
            </View>
            <Slot/>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}
