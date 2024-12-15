import { NextRequest, NextResponse } from "next/server";
import { DataSets, DataSource, IDataSource } from "data";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const dataSource: IDataSource = new DataSource();
  return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponsFusions).getOne(params.id));
}
