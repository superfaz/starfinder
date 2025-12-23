import fs from "node:fs/promises";
import path from "node:path";

async function generateBarrelFile(basePath: string): Promise<void> {
  const resultPath = path.join(basePath, "index.ts");

  await fs.writeFile(resultPath, "// This file is generated\n\n");

  const files = await fs.readdir(basePath);
  for (const file of files) {
    if (file === "index.ts" || file.endsWith(".test.ts")) {
      continue;
    }

    const filePath = `${basePath}/${file}`;
    if ((await fs.lstat(filePath)).isDirectory()) {
      fs.appendFile(resultPath, `export * from "./${file}";\n`);
    } else if (file.startsWith("_")) {
      // ignore files starting with underscore
      continue;
    } else {
      const fileName = path.parse(filePath).name;
      fs.appendFile(resultPath, `export * from "./${fileName}";\n`);
    }
  }
}

const bases = [
  "src/app/(main)/create/[characterId]/origin/actions",
  "src/logic/server",
  "src/logic/server/static",
  "src/model",
  "src/ui",
  "src/view/server",
];

for (const base of bases) {
  await generateBarrelFile(base);
}
