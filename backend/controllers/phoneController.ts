import { Request, Response } from "express";
import { URLSearchParams } from "url";
import { ObjectId } from "mongodb";
import { contactCollection, smsCollection } from "../services/db.js";
import { nubmerNormalizer } from "../components/numberNormalizer.js";
import dotenv from "dotenv";

dotenv.config();

const username = process.env.ELKS_USERNAME as string;
const password = process.env.ELKS_PASSWORD as string;
const sender = process.env.ELKS_SENDER as string;
const phoneNumber = process.env.ELKS_PHONE as string;
const auth = Buffer.from(username + ":" + password).toString("base64");

export async function sendSMS(req: Request, res: Response) {
  const { contactId, message } = req.body;
  if (!contactId || !message) {
    console.error("contactId or message missing");
    return res.status(400).send("contactId or message missing");
  } else {
    const contact = await contactCollection.findOne({
      _id: new ObjectId(contactId),
    });
    if (!contact) {
      console.error("Could not find contacts in collecion");
      return res.status(404).send("Contact not found");
    }

    let data = {
      from: sender,
      to: nubmerNormalizer(contact.number),
      message: `Non-repliable message. ${message}`,
      // dryrun: "yes", // For sending messages without it costing elks credits
    };

    const urlParamsString = new URLSearchParams(data).toString();
    try {
      const elkSMSRes = await fetch("https://api.46elks.com/a1/sms", {
        method: "POST",
        headers: {
          Authorization: "Basic " + auth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlParamsString,
      });

      const text = await elkSMSRes.text();

      let responseJSON: any;
      try {
        responseJSON = JSON.parse(text);
      } catch {
        console.warn("46elks returned non-JSON response:", text);
        responseJSON = { raw: text };
      }

      if (elkSMSRes.status === 200) {
        if (
          responseJSON.status === "created" ||
          responseJSON.status === "sent" ||
          responseJSON.status === "delivered"
        ) {
          responseJSON.userId = req.user._id;
          responseJSON.contactId = contact._id;

          await smsCollection.insertOne(responseJSON);
          return res.status(200).send("Message sent and saved to history");
        } else {
          console.error("46Elks failed to send:", responseJSON);
          res.status(500).send("Unable to send message");
        }
      } else {
        console.error("46Elks API error: ", elkSMSRes.status, responseJSON);
        return res
          .status(500)
          .send(`Failed to send message (${elkSMSRes.status})`);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      return res.status(500).send("Internal error");
    }
  }
}

export async function listSMS(req: Request, res: Response) {
  const contactId = req.params.contactId;
  try {
    const allContactSms = await smsCollection
      .find({
        userID: new ObjectId(req.user?._id),
        contactId: new ObjectId(contactId),
      })
      .toArray();
    return res.status(200).send(allContactSms);
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal error");
  }
}

export async function makePrankCall(req: Request, res: Response) {
  const formData = req.body;
  const contact = await contactCollection.findOne({
    _id: new ObjectId(formData.contactId),
  });
  if (!contact) {
    console.error("No contacts were found");
    return res.status(404).send("No contacts found");
  } else {
    let data = {
      from: phoneNumber,
      to: contact.number,
      voice_start: JSON.stringify({
        // recordcall: "https://46elks.vercel.app/recordings",
        play: "https://soundboardmp3.com/wp-content/uploads/2025/07/Nothing-beats-a-jet2-holiday.mp3",
      }),
    };

    const urlParamsString = new URLSearchParams(data).toString();

    try {
      const elkCallRes = await fetch("https://api.46elks.com/a1/calls", {
        method: "POST",
        headers: {
          Authorization: "Basic " + auth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlParamsString,
      });

      const responseJSON = await elkCallRes.json();
      if (responseJSON.state === "ongoing") {
        return res.status(200).send("Prank was successful");
      } else {
        console.error(responseJSON);
        return res.status(500).send("Call failed");
      }
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal server error in call function");
    }
  }
}
