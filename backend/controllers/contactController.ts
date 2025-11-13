import { ObjectId } from "mongodb";
import { contactCollection } from "../services/db.js";
import { console } from "inspector";
import { Request, Response } from "express";

export async function contacts(req: Request, res: Response) {
  try {
    const userContacts = await contactCollection
      .find({ userId: new ObjectId(req.user._id) })
      .toArray();
    if (userContacts) {
      return res.send(userContacts);
    } else {
      return res.status(204).send();
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal server error");
  }
}

export async function getContact(req: Request<{ id: string }>, res: Response) {
  try {
    const contact = await contactCollection.findOne({
      userId: new ObjectId(req.user._id),
      _id: new ObjectId(req.params.id),
    });
    return res.status(200).send(contact);
  } catch (e) {
    console.error(e);
    return res.status(500).send("internal server error");
  }
}

export async function createContact(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const formData = req.body;
    await contactCollection.insertOne({
      name: formData.name,
      number: formData.number,
      userId: new ObjectId(req.user._id),
    });
    return res.status(201).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal server error");
  }
}

export async function editContact(req: Request<{ id: string }>, res: Response) {
  try {
    const formData = req.body;
    await contactCollection.updateOne(
      { _id: new ObjectId(req.params.id), userId: new ObjectId(req.user._id) },
      {
        $set: {
          name: formData.name,
          number: formData.number,
        },
      }
    );
    return res.status(201).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal server error");
  }
}

export async function deleteContact(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    await contactCollection.deleteOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user._id),
    });
    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal server error");
  }
}
