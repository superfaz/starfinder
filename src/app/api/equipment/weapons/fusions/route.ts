import { NextResponse } from "next/server";
import { DataSets, StaticDataSource, IStaticDataSource } from "data";

export const dynamic = "force-dynamic";

export async function GET() {
  const dataSource: IStaticDataSource = new StaticDataSource();
  return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponFusions).getAll());
}
