import { MongoClient } from "mongodb"

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "telefonboken";

await client.connect();

const db = client.db(dbName);

export const userCollection = db.collection("users");
