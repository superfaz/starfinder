import "@testing-library/jest-dom";
import * as fs from "fs/promises";
import { beforeAll, jest } from "@jest/globals";
import { DataSetBuilder, IDataSet } from "data";
import { addFetchMock, mockFetch } from "./mocks/fetch";
import operativeDetails from "./mocks/class-operative.json";
import envoyDetails from "./mocks/class-envoy.json";
import scholarDetails from "./mocks/themes-details.json";

async function readFile(path: string) {
  return fs.readFile(path, "utf-8").then((data: string) => JSON.parse(data));
}

async function mockBuild(): Promise<IDataSet> {
  return {
    getAbilityScores: async () => readFile("./mocks/ability-scores.json"),
    getAlignments: async () => readFile("./mocks/alignments.json"),
    getAvatars: async () => readFile("./mocks/avatars.json"),
    getClasses: async () => readFile("./mocks/classes.json"),
    getClassDetails: async (classId) => readFile(`./mocks/class-${classId}.json`),
    getRaces: async () => readFile("./mocks/races.json"),
    getSkills: async () => readFile("./mocks/skills.json"),
    getThemes: async () => readFile("./mocks/themes.json"),
    getThemeDetails: async () => readFile("./mocks/themes-details.json"),
    getArmors: async () => readFile("./mocks/armors.json"),
    getWeapons: async () => readFile("./mocks/weapons.json"),
  };
}

beforeAll(() => {
  window.fetch = mockFetch;

  jest.spyOn(DataSetBuilder.prototype, "build").mockImplementation(mockBuild);

  addFetchMock("/api/classes/operative/details", operativeDetails);
  addFetchMock("/api/classes/envoy/details", envoyDetails);
  addFetchMock("/api/themes/scholar", scholarDetails);
});
