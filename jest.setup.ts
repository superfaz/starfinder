import * as fs from "fs/promises";
import { beforeAll, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { DataSetBuilder, IDataSet } from "data";

async function readFile(path: string) {
  return fs.readFile(path, "utf-8").then((data: string) => JSON.parse(data));
}

async function mockBuild(): Promise<IDataSet> {
  return {
    getAbilityScores: async () => readFile("./data/ability-scores.json"),
    getAlignments: async () => readFile("./data/alignments.json"),
    getAvatars: async () => readFile("./data/avatars.json"),
    getClasses: async () => readFile("./data/classes.json"),
    getClassDetails: async () => readFile("./data/class-operative.json"),
    getRaces: async () => readFile("./data/races.json"),
    getSkills: async () => readFile("./data/skills.json"),
    getThemes: async () => readFile("./data/themes.json"),
    getThemeDetails: async () => readFile("./data/specials.json"),
    getArmors: async () => readFile("./data/armors.json"),
    getWeapons: async () => readFile("./data/weapons.json"),
  };
}

beforeAll(() => {
  jest.spyOn(DataSetBuilder.prototype, "build").mockImplementation(mockBuild);
});
