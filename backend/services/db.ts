import { User } from "../types/types.js";
import * as mongoDB from "mongodb";

const url = "mongodb://localhost:27017";
const client = new mongoDB.MongoClient(url);
const dbName = "telefonboken";

await client.connect();

const db = client.db(dbName);

export const userCollection: mongoDB.Collection<mongoDB.OptionalId<User>> =
  db.collection("users");
export const contactCollection = db.collection("contacts");
export const smsCollection = db.collection("sms");
export const callCollection = db.collection("call");
