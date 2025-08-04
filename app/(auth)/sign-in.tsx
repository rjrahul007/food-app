import { router } from "expo-router";
import { Button, Text, View } from "react-native";

const singIn = () => {
  return (
    <View>
      <Text>singIn</Text>
      <Button title="Sign Up" onPress={() => router.push("/sign-up")} />
    </View>
  );
};

export default singIn;
