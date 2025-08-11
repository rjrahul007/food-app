import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

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
const avatars = new Avatars(client);

export const createUser = async ({email, password, name}: CreateUserParams) => {
 try {
  const newAccount = await account.create(ID.unique(), email, password, name)

  if(!newAccount) throw Error;

  await singIn({email, password});

  const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    ID.unique(),
    {
      email,
      name,
      accountid: newAccount.$id,
      avatar: avatarUrl,
    });
 } catch (error) {
  throw new Error(`Failed to create user: ${error}`);
 }
}

export const singIn = async ({email, password}: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password)
  } catch (error) {
    throw new Error(`Failed to sign in: ${error}`);
  }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountid', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

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