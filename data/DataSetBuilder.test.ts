import { describe, expect, test } from "@jest/globals";
import { DataSetBuilder } from "./DataSetBuilder";

describe("DataSetBuilder", () => {
  test("constructor()", async () => {
    const builder = new DataSetBuilder();
    expect(builder).toBeDefined();
  });

  test("build()", async () => {
    const builder = new DataSetBuilder();
    const data = await builder.build();
    expect(data).toBeDefined();
    expect(data.alignments).toBeDefined();
    expect(data.alignments.length).toBeGreaterThan(0);
  });
});
