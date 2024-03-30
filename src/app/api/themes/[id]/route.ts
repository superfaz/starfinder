import { DataSets, DataSource } from "data";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const dataSource = new DataSource();
  const dataset = await dataSource.get(DataSets.ThemeDetails);

  console.log("/themes/[id]: params.id", params.id);
  return Response.json(await dataset.getOne(params.id));
}
