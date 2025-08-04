import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const signUp = () => {
  return (
    <View>
    <Text>singIn</Text>
         <Button title="Sign In" onPress={() => router.push("/sign-up")} />
    </View>
  );
};

export default signUp;
