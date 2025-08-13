import { ID, Query } from "react-native-appwrite";
import { account, appwriteConfig, avatars, databases } from "./appwrite";
import { clearSession, getSavedSession, saveSession } from "./storage";


// Create User (Signup)
export const createUser = async ({ email, password, name }: { email: string; password: string; name: string }) => {
  try {
    await account.deleteSession("current").catch((err) => {console.warn("No existing session to delete", err);});

    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Account creation failed");
    const avatarUrl = avatars.getInitialsURL(name);
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { accountid: newAccount.$id, email, name, avatar: avatarUrl }
    );

    await signIn({email, password});

    return newAccount;
  } catch (error) {
    console.error("createUser error", error);
    throw error;
  }
};

// Sign In
export const signIn = async ({ email, password }: { email: string; password: string }) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    await saveSession(session);
    return session;
  } catch (e) {
    throw new Error(String(e));
  }
};

// Restore Session (on app start)
export const restoreSession = async () => {
  const session = await getSavedSession();
  if (!session) return null;

  try {
    // Just calling account.get() will throw if session expired
    const user = await account.get();
    return user;
  } catch {
    await clearSession();
    return null;
  }
};

// Get Current User (only if logged in)
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No account found");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountid", currentAccount.$id)] // match field name exactly
    );

    // console.log("Current User:", currentUser);

    if (!currentUser) throw new Error("No user document found");

    return currentUser.documents[0];
  } catch (e) {
    console.error("getCurrentUser error", e);
    throw e;
  }
};

// Sign Out
export const signOut = async () => {
  try {
    await account.deleteSession("current");
    await clearSession();
  } catch (error) {
    console.error("signOut error", error);
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = async (userId: string, userData: any) => {
  try {
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      userData
    );
    return updatedUser;
  } catch (error) {
    console.error("updateUserProfile error", error);
    throw new Error(`Failed to update user profile: ${error}`);
  }
}
