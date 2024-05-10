import mongoose from "mongoose";

export const SlotSchema = mongoose.model(
  "slot",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      slug: "name",
      type: String,
    },
  })
);
