import mongoose from "mongoose";

var slug = require("mongoose-slug-generator");

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL environment variable required");
}

if (!process.env.MONGO_DB_NAME) {
  throw new Error("MONGO_DB_NAME environment variable required");
}

mongoose.plugin(slug);
