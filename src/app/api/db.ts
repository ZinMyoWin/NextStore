import { MongoClient, Db, ServerApiVersion } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_USER || !process.env.MONGODB_PASSWORD) {
    throw new Error("Missing MONGODB_USER or MONGODB_PASSWORD environment variables");
  }

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mernapp.sses4.mongodb.net/?retryWrites=true&w=majority&appName=MERNapp`;
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
