import "@testing-library/jest-dom";
import { beforeAll, jest } from "@jest/globals";
import { DataSetBuilder, IDataSet } from "data";
import { addFetchMock, mockFetch } from "./mocks/fetch";
import envoyDetails from "./mocks/class-envoy.json";
import operativeDetails from "./mocks/class-operative.json";
import scholarDetails from "./mocks/themes-details.json";
import soldierDetails from "./mocks/class-soldier.json";
import {
  AbilityScore,
  Alignment,
  Armor,
  Avatar,
  Class,
  FeatTemplate,
  Race,
  SavingThrow,
  SkillDefinition,
  Theme,
  ThemeScholar,
  Weapon,
} from "model";

async function mockBuild(): Promise<IDataSet> {
  return {
    getAbilityScores: async () => AbilityScore.array().parse((await import("./mocks/ability-scores.json")).default),
    getAlignments: async () => Alignment.array().parse((await import("./mocks/alignments.json")).default),
    getAvatars: async () => Avatar.array().parse((await import("./mocks/avatars.json")).default),
    getClasses: async () => Class.array().parse((await import("./mocks/classes.json")).default),
    getClassDetails: async (classId) => (await import(`./mocks/class-${classId}.json`)).default,
    getRaces: async () => Race.array().parse((await import("./mocks/races.json")).default),
    getFeats: async () => FeatTemplate.array().parse((await import("./mocks/feats.json")).default),
    getThemes: async () => Theme.array().parse((await import("./mocks/themes.json")).default),
    getThemeDetails: async () => ThemeScholar.parse((await import("./mocks/themes-details.json")).default),
    getSavingThrows: async () => SavingThrow.array().parse((await import("./mocks/saving-throws.json")).default),
    getSkills: async () => SkillDefinition.array().parse((await import("./mocks/skills.json")).default),
    getArmors: async () => Armor.array().parse((await import("./mocks/armors.json")).default),
    getWeapons: async () => Weapon.array().parse((await import("./mocks/weapons.json")).default),
  };
}

beforeAll(() => {
  window.fetch = mockFetch;

  jest.spyOn(DataSetBuilder.prototype, "build").mockImplementation(mockBuild);

  addFetchMock("/api/classes/envoy/details", envoyDetails);
  addFetchMock("/api/classes/operative/details", operativeDetails);
  addFetchMock("/api/classes/soldier/details", soldierDetails);
  addFetchMock("/api/themes/scholar", scholarDetails);
});
