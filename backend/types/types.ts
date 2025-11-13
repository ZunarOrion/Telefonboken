import { ObjectId } from "mongodb";

export type Contact = {
  _id: string;
  name: string;
  number: string;
};

export type SignupBody = {
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type User = {
  _id: ObjectId;
  email: string;
  password: string;
};

export type TokenPayload = {
  _id: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: ObjectId | string;
        email: string;
      };
    }
  }
}
