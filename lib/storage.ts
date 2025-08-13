// storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "appwrite_session";

export const saveSession = async (session: any) => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSavedSession = async () => {
  const stored = await AsyncStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};
