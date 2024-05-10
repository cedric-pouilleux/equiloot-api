import mongoose from "mongoose";

export const ItemSchema = mongoose.model(
  "item",
  new mongoose.Schema({
    _id: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      slug: "title",
      type: String,
    },
    gearType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stuff-type",
      required: false,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "slot",
      required: false,
    },
    dungeon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dungeon",
      required: false,
    },
    source: String,
    picture: String,
    link: String,
    pictureUrl: String,
  })
);
