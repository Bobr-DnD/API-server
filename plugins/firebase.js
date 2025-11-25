import admin from "firebase-admin";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(
  readFileSync("./firebase-admin.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_URL
});

export const bucket = admin.storage().bucket();
