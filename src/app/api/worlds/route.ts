import { DataSets, DataSource } from "data";

export const dynamic = "force-dynamic";

export async function GET() {
  const dataSource = new DataSource();
  const dataset = dataSource.get(DataSets.Worlds);
  return Response.json(await dataset.getAll());
}
