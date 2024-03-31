import { describe, expect, test } from "vitest";
import { DataSource, DataSets } from ".";

describe("DataSource", () => {
  test("constructor()", async () => {
    const dataSource = new DataSource();
    expect(dataSource).toBeDefined();
  });

  const cases: string[] = Object.keys(DataSets);

  test.each(cases)("get(DataSets.%s)", async (datasetKey) => {
    const dataSource = new DataSource();
    const dataSet = dataSource.get(DataSets[datasetKey as keyof typeof DataSets]);
    expect(dataSet).toBeDefined();

    const documents = await dataSet.getAll();
    expect(documents.length).toBeGreaterThan(0);
  });
});
