import { SignupBody, LoginBody } from "../types/types.js";
import { userCollection } from "../services/db.js";
import { generateToken } from "../services/jwt.js";
import { Request, Response } from "express";

async function emailAvailable(email: string) {
  let user;
  try {
    user = await userCollection.findOne({ email: email });
  } catch (e) {
    console.error(e);
    throw new Error("Database error!");
  }
  if (user) {
    return false;
  } else {
    return true;
  }
}

export async function signup(req: Request<{}, {}, SignupBody>, res: Response) {
  const formData = req.body;
  try {
    if (await emailAvailable(formData.email)) {
      const createdUser = await userCollection.insertOne({
        email: formData.email,
        password: formData.password,
      });
      return res.status(200).send(
        await generateToken({
          _id: createdUser.insertedId.toString(),
          email: formData.email,
        })
      );
    } else {
      return res.status(400).send("Email already taken!");
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal server error");
  }
}

export async function login(req: Request<{}, {}, LoginBody>, res: Response) {
  if (req.headers.authorization) {
    return;
  }
  const formData = req.body;
  try {
    const user = await userCollection.findOne({
      email: formData.email,
      password: formData.password,
    });
    if (user) {
      try {
        return res.status(200).send(
          await generateToken({
            _id: user._id.toString(),
            email: formData.email,
          })
        );
      } catch (e) {
        console.error(e);
        return res.status(500).send("Internal error, try again!");
      }
    } else {
      return res.status(400).send("Invalid credentials");
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal server error");
  }
}
