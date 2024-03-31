import { DataSets, DataSource } from "data";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const dataSource = new DataSource();
  const dataset = dataSource.get(DataSets.ThemeDetails);
  return Response.json(await dataset.getOne(params.id));
}
