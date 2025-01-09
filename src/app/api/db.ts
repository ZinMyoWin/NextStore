import { MongoClient, Db, ServerApiVersion } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mernapp.sses4.mongodb.net/?retryWrites=true&w=majority&appName=MERNapp`;

export async function connectToDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_USER || !process.env.MONGODB_PASSWORD) {
    throw new Error("Missing MONGODB_USER or MONGODB_PASSWORD environment variables");
  }

  const dbName = process.env.MONGODB_DB || "ecommerce";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    cachedClient = client;
    cachedDb = client.db(dbName);
    return { client, db: cachedDb };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}
 
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}
 
let client: MongoClient
 
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient
  }
 
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options)
  }
  client = globalWithMongo._mongoClient
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
}
 
// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client
