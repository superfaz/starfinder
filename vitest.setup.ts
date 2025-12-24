import { afterAll, beforeAll, vi } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { addFetchMock, mockFetch } from "./mocks/fetch";

import "@testing-library/jest-dom/vitest";

dotenv.config({ path: ".env.test" });

if (!process.env.STARFINDER_SHARED_SERVER) {
  const mongod = await MongoMemoryServer.create();
  process.env.STARFINDER_MONGO_URI = mongod.getUri();

  afterAll(async () => {
    await mongod.stop();
  });
}

beforeAll(async () => {
  console.log("Connecting to", process.env.STARFINDER_MONGO_URI);

  // Prepare mock data
  const client = new MongoClient(process.env.STARFINDER_MONGO_URI!);
  await client.connect();
  await client.db(process.env.STARFINDER_MONGO_DATABASE + "-fr").dropDatabase();

  // Loop all files from mocks to load them into mongodb
  const mockFolder = path.resolve(__dirname, "./mocks");
  const files = await fs.readdir(mockFolder);
  for (const file of files) {
    if (path.extname(file) === ".json") {
      const data = await import(path.resolve(mockFolder, file));
      const collection = path.basename(file, ".json");
      await client.db(process.env.STARFINDER_MONGO_DATABASE + "-fr").collection(collection).insertMany(data.default);
    }
  }
});

beforeAll(async () => {
  vi.stubGlobal("fetch", mockFetch);
  addFetchMock("/api/auth/setup", {});
});
