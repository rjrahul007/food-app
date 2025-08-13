import useAuthStore from "@/store/auth.store";
import * as Sentry from '@sentry/react-native';
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import "./globals.css";

Sentry.init({
  dsn: 'https://5559298f4f2d14bb55f3d140d12aa44d@o4509388981927936.ingest.us.sentry.io/4509790982701056',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});



export default Sentry.wrap(function RootLayout() {
  const {isLoading, init} = useAuthStore();
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
  
  useEffect(() => {
    init()
  }, []);

  if(!fontsLoaded || isLoading) return null;
  

  return(  
  <>
  <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true}/> 
  <Stack screenOptions={{headerShown: false}}/>
  </>);
});