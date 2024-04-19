var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// index.ts
var import_cors = __toESM(require("cors"));
var import_express = __toESM(require("express"));
var import_mongodb = require("mongodb");
var uri = "mongodb://localhost:27017";
var app = (0, import_express.default)();
app.use((0, import_cors.default)());
app.get("/items", async (req, res) => {
  const client = new import_mongodb.MongoClient(uri);
  try {
    await client.connect();
    await client.db("equiloot").command({ ping: 1 });
  } finally {
    await client.close();
  }
  res.json({
    "foot": "bare2"
  });
});
app.listen(4e3, "0.0.0.0");
