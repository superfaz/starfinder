import { NextResponse } from "next/server";
import { DataSets, DataSource, IDataSource } from "data";

export const dynamic = "force-dynamic";

export async function GET() {
  const dataSource: IDataSource = new DataSource();
  return NextResponse.json(await dataSource.get(DataSets.EquipmentArmorsUpgrade).getAll());
}
