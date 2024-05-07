import mongoose from "mongoose";
import { ItemSchema, SlotSchema, StuffTypeSchema } from "./db-schemas";
import fs from "node:fs/promises";

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL environment variable required");
}

if (!process.env.MONGO_DB_NAME) {
  throw new Error("MONGO_DB_NAME environment variable required");
}

async function insertSlotsFixtures() {
  await SlotSchema.create(
    { name: "Tête" },
    { name: "Cou" },
    { name: "Epaule" },
    { name: "Dos" },
    { name: "Torse" },
    { name: "Poignets" },
    { name: "Mains" },
    { name: "Taille" },
    { name: "Jambes" },
    { name: "Pieds" },
    { name: "Doigt" },
    { name: "Bijou" },
    { name: "Relique" },
    { name: "Main gauche" },
    { name: "Main droite" },
    { name: "Tenu en main gauche" },
    { name: "A une main" },
    { name: "Deux mains" },
    { name: "A distance" },
    { name: "Bouclier" }
  );
}

async function insertStuffTypesFixtures() {
  await StuffTypeSchema.create(
    { name: "Bijou" },
    { name: "Armures en tissu" },
    { name: "Armures en cuir" },
    { name: "Armures en plaques" },
    { name: "Accessoire pour main gauche" },
    { name: "Armures en mailles" },
    { name: "Bouclier" },
    { name: "Libram" },
    { name: "Totem" },
    { name: "Cape" },
    { name: "Arbalète" },
    { name: "Masse à une main" },
    { name: "Masse à deux mains" },
    { name: "Bâton" },
    { name: "Dague" },
    { name: "Épée à une main" },
    { name: "Épée à deux mains" },
    { name: "Hache à une main" },
    { name: "Hache à deux mains" },
    { name: "Arme de pugilat" },
    { name: "Armes d'hast" },
    { name: "Jeton" },
    { name: "Quête" },
    { name: "Anneau" },
    { name: "Arme à feu" },
    { name: "Arc" },
    { name: "Schéma d'ingénierie" }
  );
}

async function insertItemsFixtures() {
  fs.readFile("./data.json", "utf-8")
    .then(async (data) => {
      const items: any[] = JSON.parse(data);
      for (const item of items) {
        const { gearType, slot } = item;
        const findSlot = slot.length
          ? await SlotSchema.findOne({ name: slot }).exec()
          : undefined;
        const findGearType = gearType.length
          ? await StuffTypeSchema.findOne({
              name: gearType,
            }).exec()
          : undefined;
        await ItemSchema.create({
          ...item,
          slot: findSlot?._id,
          gearType: findGearType?._id,
        });
      }
    })
    .catch((err: any) => {
      Promise.reject(err);
    })
    .finally(() => {
      Promise.resolve();
    });
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      dbName: process.env.MONGO_DB_NAME,
    });
    await insertSlotsFixtures();
    await insertStuffTypesFixtures();
    await insertItemsFixtures();
  } catch (e) {
    console.log(e);
  } finally {
    const items = await ItemSchema.find()
      .populate("slot")
      .populate("gearType")
      .exec();
    await mongoose.disconnect();
  }
})();
