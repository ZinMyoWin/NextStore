import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mernapp.sses4.mongodb.net/?retryWrites=true&w=majority&appName=MERNapp`;

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDB() {
  if (!process.env.MONGODB_USER || !process.env.MONGODB_PASSWORD) {
    throw new Error(
      "Missing MONGODB_USER or MONGODB_PASSWORD environment variables"
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "ecommerce");
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

// Export the clientPromise for use with NextAuth
export default clientPromise;
