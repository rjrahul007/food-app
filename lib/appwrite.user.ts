import { UpdateUserParams } from "@/type";
import { ID, Query } from "react-native-appwrite";
import { account, appwriteConfig, databases } from "./appwrite";

export const createUser = async ({ email, password, name }: { email: string, password: string, name: string }) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Account creation failed");

    // Create user document in DB
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountid: newAccount.$id,
        email,
        name
      }
    );

    // Auto-login after creation
    await account.createEmailPasswordSession(email, password);

    return newAccount;
  } catch (error) {
    console.error("createUser error", error);
    throw error;
  }
};

export const signIn = async ({ email, password }: { email: string, password: string }) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error("signIn error", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    console.error("signOut error", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) return null;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountid", currentAccount.$id)]
    );

    return currentUser.documents[0] ?? null;
  } catch (error) {
    console.error("getCurrentUser error", error);
    return null;
  }
};


export const updateUserProfile = async (userId: string, userData: UpdateUserParams) => {
  try {
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      userData
    );
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update user profile: ${error}`);
  }
};