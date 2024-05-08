import mongoose from "mongoose";
import {
  ItemSchema,
  DungeonSchema,
  SlotSchema,
  StuffTypeSchema,
} from "./db-schemas";
import fs from "node:fs/promises";

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL environment variable required");
}

if (!process.env.MONGO_DB_NAME) {
  throw new Error("MONGO_DB_NAME environment variable required");
}

const SlotSchemaFixtures = [
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
  { name: "Bouclier" },
];

const stuffGearSchemaFixtures = [
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
  { name: "Schéma d'ingénierie" },
];

const DungeonSchemaFixtures = [
  { name: "Les profondeurs de Brassenoire" },
  { name: "Gnomeregan" },
  { name: "Le temple d'Atal'Hakkar" },
];

async function insertSlotsFixtures() {
  try {
    for await (const slot of DungeonSchemaFixtures) {
      await DungeonSchema.findOneAndUpdate(slot, slot, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }
  } catch (err: any) {
    console.log(err);
  }
}

async function insertDungeonsFixtures() {
  try {
    for await (const slot of SlotSchemaFixtures) {
      await SlotSchema.findOneAndUpdate(slot, slot, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }
  } catch (err: any) {
    console.log(err);
  }
}

async function insertStuffTypesFixtures() {
  try {
    for await (const gear of stuffGearSchemaFixtures) {
      await StuffTypeSchema.findOneAndUpdate(gear, gear, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }
  } catch (err: any) {
    console.log(err);
  }
}

async function insertItemsFixtures() {
  return fs
    .readFile("./data.json", "utf-8")
    .then(async (data) => {
      const items: any[] = await JSON.parse(data);
      for await (const item of items) {
        const { gearType, slot, dungeon } = item;
        const findSlot = slot.length
          ? await SlotSchema.findOne({ name: slot }).exec()
          : undefined;
        const findGearType = gearType.length
          ? await StuffTypeSchema.findOne({
              name: gearType,
            }).exec()
          : undefined;
        const dungeonType = dungeon.length
          ? await DungeonSchema.findOne({
              name: dungeon,
            }).exec()
          : undefined;
        await ItemSchema.findOneAndUpdate(
          { wowId: item.wowId },
          {
            ...item,
            slot: findSlot?._id,
            gearType: findGearType?._id,
            dungeon: dungeonType?._id,
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
      }
    })
    .catch((err: any) => {
      return Promise.reject(err);
    })
    .finally(() => {
      return Promise.resolve();
    });
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      dbName: process.env.MONGO_DB_NAME,
    });
    await insertDungeonsFixtures();
    await insertSlotsFixtures();
    await insertStuffTypesFixtures();
    await insertItemsFixtures();
  } catch (e) {
    console.log(e);
  } finally {
    await mongoose.connection.close();
  }
})();
