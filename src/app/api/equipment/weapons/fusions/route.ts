import { DataSets, DataSource, IDataSource } from "data";
import { NextResponse } from "next/server";

export async function GET() {
  const dataSource: IDataSource = new DataSource();
  return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponFusions).getAll());
}
