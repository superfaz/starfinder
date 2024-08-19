import { DataSets, StaticDataSource } from "data";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const dataSource = new StaticDataSource();
  const dataset = dataSource.get(DataSets.ThemeDetails);
  return Response.json(await dataset.getOne(params.id));
}
