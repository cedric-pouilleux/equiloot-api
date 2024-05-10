import mongoose from "mongoose";
import { ItemSchema } from "../schemas/items";

export async function items(): Promise<any> {
  let arr: any[] = [];
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      dbName: process.env.MONGO_DB_NAME,
    });
  } catch (e) {
    console.log(e);
  } finally {
    arr = await ItemSchema.find()
      .populate("slot")
      .populate("gearType")
      .populate("dungeon")
      .exec();
    await mongoose.disconnect();
  }
  return arr;
}
