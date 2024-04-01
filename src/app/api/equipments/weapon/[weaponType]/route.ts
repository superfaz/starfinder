import { DataSets, DataSource, IDataSource } from "data";
import { EquipmentWeaponIdSchema, EquipmentWeaponIds } from "model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { weaponType: string } }) {
  const dataSource: IDataSource = new DataSource();

  const weaponType: string = EquipmentWeaponIdSchema.parse(params.weaponType);
  switch (weaponType) {
    case EquipmentWeaponIds.basic:
      return NextResponse.json(dataSource.get(DataSets.EquipmentWeaponBasic).getAll());
    case EquipmentWeaponIds.advanced:
      return NextResponse.json(dataSource.get(DataSets.EquipmentWeaponAdvanced).getAll());
    case EquipmentWeaponIds.small:
      return NextResponse.json(dataSource.get(DataSets.EquipmentWeaponSmall).getAll());
    case EquipmentWeaponIds.long:
      return NextResponse.json(dataSource.get(DataSets.EquipmentWeaponLong).getAll());
    case EquipmentWeaponIds.heavy:
      return NextResponse.json(dataSource.get(DataSets.EquipmentWeaponHeavy).getAll());
    case EquipmentWeaponIds.sniper:
      return NextResponse.json(dataSource.get(DataSets.EquipmentWeaponSniper).getAll());
    case EquipmentWeaponIds.grenade:
      return NextResponse.json(dataSource.get(DataSets.EquipmentWeaponGrenade).getAll());
    case EquipmentWeaponIds.solarian:
      return NextResponse.json(dataSource.get(DataSets.EquipmentWeaponSolarian).getAll());
    case EquipmentWeaponIds.ammunition:
      return NextResponse.json(dataSource.get(DataSets.EquipmentWeaponAmmunition).getAll());
    default:
      return NextResponse.error();
  }
}
