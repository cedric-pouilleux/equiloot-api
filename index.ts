import { type Express } from "express";
import express from "express";
import cors from "cors";
import { itemsExtract } from "./routes/admin";
import { items } from "./routes/items";
import "./mongodb.config";
import "./cloudinary.config";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/items", async (_, res) => {
  const response = await items();
  res.json(response);
});

app.post("/extract", async (req, res) => {
  const response = await itemsExtract(req.body);
  res.json(response);
});

app.listen(4000, "0.0.0.0");
