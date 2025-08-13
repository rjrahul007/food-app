import { GetMenuParams } from "@/type";
import { Account, Avatars, Client, Databases, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!, 
  platform: 'com.rj.foodapp',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DB!,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_DB!,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION!,
  categoriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION!,
  menuCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION!,
  customizationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATION_COLLECTION!,
  menuCustomizationsCollectionId : process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATION_COLLECTION!
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) 
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);


export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

// export const createUser = async ({email, password, name}: CreateUserParams) => {
//  try {
//   const newAccount = await account.create(ID.unique(), email, password, name)

//   if(!newAccount) throw Error;

//   await singIn({email, password});

//   const avatarUrl = avatars.getInitialsURL(name);

//     return await databases.createDocument(
//     appwriteConfig.databaseId,
//     appwriteConfig.userCollectionId,
//     ID.unique(),
//     {
//       email,
//       name,
//       accountid: newAccount.$id,
//       avatar: avatarUrl,
//     });
//  } catch (error) {
//   throw new Error(`Failed to create user: ${error}`);
//  }
// }

// export const singIn = async ({email, password}: SignInParams) => {
//   const {setIsAuthenticated, setUser} = useAuthStore.getState();
//   try {
//     // First, try to delete any existing session
//     try {
//       await account.deleteSession('current');
//     } catch (error) {
//       // Ignore errors when deleting session (might not exist)
//       console.log('No existing session to delete', error);
//     }
    
//     const session = await account.createEmailPasswordSession(email, password);
    
//     if (!session) {
//       throw new Error('Failed to create session');
//     }
//     setIsAuthenticated(true);
//     const user = await getCurrentUser();
//     setUser(user as unknown as User);
//     return session;
//   } catch (error: any) {
//     console.error('Sign in error:', error);
//     throw new Error(`Failed to sign in: ${error.message || error}`);
//   }
// };

// export const getCurrentUser = async () => {
//     try {
//         const currentAccount = await account.get();
//         if(!currentAccount) throw Error;

//         const currentUser = await databases.listDocuments(
//             appwriteConfig.databaseId,
//             appwriteConfig.userCollectionId,
//             [Query.equal('accountid', currentAccount.$id)]
//         )

//         if(!currentUser) throw Error;

//         return currentUser.documents[0];
//     } catch (e) {
//         console.log(e);
//         throw new Error(e as string);
//     }
// }

// export const updateUserProfile = async (userId: string, userData: UpdateUserParams) => {
//   try {
//     const updatedUser = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       userId,
//       userData
//     );
//     return updatedUser;
//   } catch (error) {
//     throw new Error(`Failed to update user profile: ${error}`);
//   }
// };

// // Function to sign out
// export const signOut = async () => {
  
//   try {
//     const session = await account.deleteSession('current');
//     const { setIsAuthenticated, setUser } = useAuthStore.getState();
//     setIsAuthenticated(false);
//     setUser(null);
//     return session;
//   } catch (error) {
//     throw new Error(`Failed to sign out: ${error}`);
//   }
// };

// // Function to update user avatar
// export const updateUserAvatar = async (userId: string, imageFile: any) => {
//   try {
//     // Upload image to storage
//     const uploadedFile = await storage.createFile(
//       appwriteConfig.bucketId,
//       ID.unique(),
//       imageFile
//     );
    
//     // Get file URL
//     const fileUrl = storage.getFileView(appwriteConfig.bucketId, uploadedFile.$id);
    
//     // Update user document with new avatar URL
//     const updatedUser = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       userId,
//       {
//         avatar: fileUrl
//       }
//     );
    
//     return updatedUser;
//   } catch (error) {
//     throw new Error(`Failed to update avatar: ${error}`);
//   }
// };

export const getMenu = async ({category, query}: GetMenuParams) => {
    try {
        const queries: string[] = [];
        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));
        const menu = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries
        );
        return menu.documents;
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}
export const getCategories = async () => {
    try {
      const categories = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId
      );
      return categories.documents;
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}