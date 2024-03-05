import { describe, expect, test } from "vitest";
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
    "getArmorTypes",
    "getAvatars",
    "getBooks",
    "getClasses",
    "getClassDetails",
    "getRaces",
    "getSkills",
    "getThemes",
    "getThemeDetails",
    "getWeaponCategories",
    "getWeaponTypes",
  ];

  test.each(cases)("%s()", async (method: keyof IDataSet) => {
    const builder = new DataSetBuilder();
    const data: IDataSet = await builder.build();
    if (method === "getClassDetails") {
      const classId = "operative";
      await expect(data[method](classId)).resolves.toBeDefined();
      await expect(data[method](classId)).resolves.toHaveProperty("features");
    } else if (method === "getThemeDetails") {
      const themeId = "scholar";
      await expect(data[method](themeId)).resolves.toBeDefined();
      await expect(data[method](themeId)).resolves.toHaveProperty("values");
    } else {
      await expect(data[method]()).resolves.toBeDefined();
      await expect(data[method]()).resolves.toHaveProperty("length");
    }
  });
});
