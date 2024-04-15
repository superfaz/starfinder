import { DataSets, DataSource, IDataSource } from "data";
import { EquipmentWeaponId, EquipmentWeaponIdSchema, EquipmentWeaponIds } from "model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { weaponType: string } }) {
  const dataSource: IDataSource = new DataSource();

  const weaponType: EquipmentWeaponId = EquipmentWeaponIdSchema.parse(params.weaponType);
  switch (weaponType) {
    case EquipmentWeaponIds.basic:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponBasic).getAll());
    case EquipmentWeaponIds.advanced:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponAdvanced).getAll());
    case EquipmentWeaponIds.small:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponSmall).getAll());
    case EquipmentWeaponIds.long:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponLong).getAll());
    case EquipmentWeaponIds.heavy:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponHeavy).getAll());
    case EquipmentWeaponIds.sniper:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponSniper).getAll());
    case EquipmentWeaponIds.grenade:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponGrenade).getAll());
    case EquipmentWeaponIds.solarian:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponSolarian).getAll());
    case EquipmentWeaponIds.ammunition:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponAmmunition).getAll());
    default:
      return NextResponse.error();
  }
}
