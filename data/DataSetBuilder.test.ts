import { describe, expect, test } from "@jest/globals";
import { DataSetBuilder, IDataSet } from ".";

describe("DataSetBuilder", () => {
  test("constructor()", async () => {
    const builder = new DataSetBuilder();
    expect(builder).toBeDefined();
  });

  test("build()", async () => {
    const builder = new DataSetBuilder();
    const data: IDataSet = await builder.build();
    expect(data).toBeDefined();
  });

  const cases: Array<keyof IDataSet> = [
    "getAbilityScores",
    "getAlignments",
    "getAvatars",
    "getClasses",
    "getClassDetails",
    "getRaces",
    "getSkills",
    "getThemes",
    "getThemeDetails",
    "getArmors",
    "getWeapons",
  ];

  test.each(cases)("%s()", async (method: keyof IDataSet) => {
    const builder = new DataSetBuilder();
    const data: IDataSet = await builder.build();
    if (method === "getClassDetails") {
      const classId = "operative";
      await expect(data[method](classId)).resolves.toBeDefined();
      await expect(data[method](classId)).resolves.toHaveProperty("length");
    } else if (method === "getThemeDetails") {
      const themeId = "scholar";
      await expect(data[method](themeId)).resolves.toBeDefined();
      await expect(data[method](themeId)).resolves.toHaveProperty("length");
    } else {
      await expect(data[method]()).resolves.toBeDefined();
      await expect(data[method]()).resolves.toHaveProperty("length");
    }
  });
});
