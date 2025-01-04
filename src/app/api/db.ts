import { MongoClient, Db, ServerApiVersion } from "mongodb";

// user name: stuperman
// password: stupermanhiding
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mernapp.sses4.mongodb.net/?retryWrites=true&w=majority&appName=MERNapp`;

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();

  cachedClient = client;
  cachedDb = client.db("ecommerce");

  return { client, db: client.db("ecommerce") };
}
