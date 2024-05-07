import { type Express } from "express";
import express from "express";
import { ItemSchema } from "./db-schemas";
import cors from "cors";
import mongoose from "mongoose";

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL environment variable required");
}

if (!process.env.MONGO_BD_NAME) {
  throw new Error("MONGO_BD_NAME environment variable required");
}

const app: Express = express();
app.use(cors());

app.get("/items", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      dbName: process.env.MONGO_BD_NAME,
    });
  } catch (e) {
    console.log(e);
  } finally {
    const items = await ItemSchema.find()
      .populate("slot")
      .populate("gearType")
      .exec();
    await mongoose.disconnect();
    res.json(items);
  }
});

app.listen(4000, "0.0.0.0");
