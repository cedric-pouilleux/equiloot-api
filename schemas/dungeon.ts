import mongoose from "mongoose";

export const DungeonSchema = mongoose.model(
  "dungeon",
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
    url: {
      type: String,
      required: true,
      unique: true,
    },
  })
);
