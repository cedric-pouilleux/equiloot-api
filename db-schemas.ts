import mongoose from "mongoose";

var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

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

export const ItemSchema = mongoose.model(
  "item",
  new mongoose.Schema({
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
    picture: String,
    pictureUrl: String,
    wowId: {
      type: Number,
      unique: true,
      required: true,
    },
    link: String,
    dungeon: String,
    source: String,
  })
);
