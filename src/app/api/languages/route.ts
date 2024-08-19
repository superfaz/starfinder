import { DataSets, StaticDataSource } from "data";

export const dynamic = "force-dynamic";

export async function GET() {
  const dataSource = new StaticDataSource();
  const dataset = dataSource.get(DataSets.Languages);
  return Response.json(await dataset.getAll());
}
