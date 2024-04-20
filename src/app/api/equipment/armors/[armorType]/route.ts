import { DataSets, DataSource, IDataSource } from "data";
import { ArmorTypeId, ArmorTypeIdSchema, ArmorTypeIds } from "model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { armorType: string } }) {
  const dataSource: IDataSource = new DataSource();

  const armorType: ArmorTypeId = ArmorTypeIdSchema.parse(params.armorType);
  switch (armorType) {
    case ArmorTypeIds.light:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentArmorLight).getAll());
    case ArmorTypeIds.heavy:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentArmorHeavy).getAll());
    case ArmorTypeIds.powered:
    default:
      return NextResponse.error();
  }
}