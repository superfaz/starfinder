import { NextRequest, NextResponse } from "next/server";
import { DataSets, StaticDataSource, IStaticDataSource } from "data";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const dataSource: IStaticDataSource = new StaticDataSource();
  return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponFusions).getOne(params.id));
}
