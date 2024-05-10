import mongoose from "mongoose";

export const StuffTypeSchema = mongoose.model(
  "stuff-type",
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
