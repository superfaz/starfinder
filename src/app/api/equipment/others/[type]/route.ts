import { NextRequest, NextResponse } from "next/server";
import { DataSets, DataSource, IDataSource } from "data";
import { EquipmentOtherId, EquipmentOtherIdSchema, EquipmentOtherIds } from "model";

export async function GET(_: NextRequest, { params }: { params: { type: string } }) {
  const dataSource: IDataSource = new DataSource();

  const type: EquipmentOtherId = EquipmentOtherIdSchema.parse(params.type);
  if (type === EquipmentOtherIds.augmentation) {
    return NextResponse.json(await dataSource.get(DataSets.EquipmentOtherAugmentations).getAll());
  } else {
    return NextResponse.error();
  }
}
