import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { validateToken } from "./services/jwt.js";
import { ObjectId } from "mongodb";
import {
  contacts,
  createContact,
  deleteContact,
  getContact,
  editContact,
} from "./controllers/contactController.js";
import {
  sendSMS,
  listSMS,
  makePrankCall,
} from "./controllers/phoneController.js";
import { userCollection } from "./services/db.js";
import { User } from "./types/types.js";
import { signup, login } from "./controllers/userController.js";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

async function auth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return res.status(400).send("Missing Authentication Header");
  }
  try {
    const decoded = await validateToken(req.headers.authorization);
    if (!decoded) {
      return res.status(401).send("Token is invalid or expired");
    } else {
      const user = await userCollection.findOne<User>({
        _id: new ObjectId(decoded._id),
        email: decoded.email,
      });
      if (!user) {
        return res.status(401).send("User not found");
      }
      req.user = user;
      next();
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Inernal server error");
  }
}

app.post("/signup", signup);
app.post("/login", login);
app.get("/contacts", auth, contacts);
app.get("/contacts/:id", auth, getContact);
app.post("/contacts/create", auth, createContact);
app.put("/contacts/edit/:id", auth, editContact);
app.delete("/contacts/delete/:id", auth, deleteContact);
app.post("/sms/send", auth, sendSMS);
app.get("/sms/:contactId", auth, listSMS);
app.post("/call/prank-call", auth, makePrankCall);

app.listen(port, () => {
  console.log(`App running at ${port}`);
});
