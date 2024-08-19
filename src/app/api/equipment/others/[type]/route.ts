import { NextRequest, NextResponse } from "next/server";
import { DataSets, StaticDataSource, IStaticDataSource } from "data";
import { EquipmentOtherId, EquipmentOtherIdSchema, EquipmentOtherIds } from "model";

export async function GET(_: NextRequest, { params }: { params: { type: string } }) {
  const dataSource: IStaticDataSource = new StaticDataSource();

  const type: EquipmentOtherId = EquipmentOtherIdSchema.parse(params.type);
  if (type === EquipmentOtherIds.augmentation) {
    return NextResponse.json(await dataSource.get(DataSets.EquipmentOtherAugmentation).getAll());
  } else {
    return NextResponse.error();
  }
}
