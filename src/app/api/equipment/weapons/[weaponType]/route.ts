import { NextRequest, NextResponse } from "next/server";
import { DataSets, DataSource, IDataSource } from "data";
import { EquipmentWeaponId, EquipmentWeaponIdSchema, EquipmentWeaponIds } from "model";

export async function GET(_: NextRequest, { params }: { params: { weaponType: string } }) {
  const dataSource: IDataSource = new DataSource();

  const weaponType: EquipmentWeaponId = EquipmentWeaponIdSchema.parse(params.weaponType);
  switch (weaponType) {
    case EquipmentWeaponIds.basic:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponsBasic).getAll());
    case EquipmentWeaponIds.advanced:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponsAdvanced).getAll());
    case EquipmentWeaponIds.small:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponsSmall).getAll());
    case EquipmentWeaponIds.long:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponsLong).getAll());
    case EquipmentWeaponIds.heavy:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponsHeavy).getAll());
    case EquipmentWeaponIds.sniper:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponsSniper).getAll());
    case EquipmentWeaponIds.grenade:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponsGrenade).getAll());
    case EquipmentWeaponIds.solarian:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponsSolarian).getAll());
    case EquipmentWeaponIds.ammunition:
      return NextResponse.json(await dataSource.get(DataSets.EquipmentWeaponsAmmunition).getAll());
    default:
      return NextResponse.error();
  }
}
