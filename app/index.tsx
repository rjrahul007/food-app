import { Text, View } from "react-native";
import "./globals.css";
 
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-5xl font-bold text-primary text-center font-quicksand-bold">
        Welcome to Food-delivery App!
      </Text>
    </View>
  );
}