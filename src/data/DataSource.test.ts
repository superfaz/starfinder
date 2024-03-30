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
    const promise = dataSource.get(DataSets[datasetKey as keyof typeof DataSets]);
    await expect(promise).resolves.toBeDefined();
  });
});
