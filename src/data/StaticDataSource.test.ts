import { describe, expect, test } from "vitest";
import { StaticDataSource, DataSets } from ".";

describe("DataSource", () => {
  test("constructor()", async () => {
    const dataSource = new StaticDataSource();
    expect(dataSource).toBeDefined();
  });

  const cases: string[] = Object.keys(DataSets);

  test.each(cases)("get(DataSets.%s)", async (datasetKey) => {
    const dataSource = new StaticDataSource();
    const dataSet = dataSource.get(DataSets[datasetKey as keyof typeof DataSets]);
    expect(dataSet).toBeDefined();

    const documents = await dataSet.getAll();
    expect(documents).not.toBeNull();
  });
});
