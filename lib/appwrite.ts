import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.loogeek.aora",
  projectId: "671cb89d00307ce28780",
  storageId: "671e41f9001a66d74d6a",
  databaseId: "671d069200189921ad09",
  userCollectionId: "671e3c320034ed1f96ed",
  videoCollectionId: "671e3ea7000df091e2f5",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(
  email: string,
  password: string,
  username: string
) {
  try {
    const id = ID.unique();
    console.log(1111111111, id, email, password, username);
    const newAccount = await account.create(id, email, password, username);
    console.log(5555555, !newAccount);
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);
    console.log(332222, avatarUrl);
    await signIn(email, password);
    console.log(6666666);
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );
    console.log(3333333, newAccount, newUser);
    return newUser;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}
