import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./globals.css";



export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "quicksand-bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "quicksand-semi-bold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "quicksand-regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "quicksand-medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "quicksand-light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);
  

  return <Stack screenOptions={{headerShown: false}}/>;
}
