import { DataSets, DataSource, IDataSource } from "data";
import { EquipmentTypeSchema, EquipmentTypes, WeaponTypeIdSchema } from "model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { type1: string; type2: string } }) {
  const dataSource: IDataSource = new DataSource();
  const data = dataSource.get(DataSets.EquipmentWeaponMelee);

  const type1 = EquipmentTypeSchema.parse(params.type1);
  switch (type1) {
    case EquipmentTypes.weaponAmmunition:
    case EquipmentTypes.weaponSolarian:
    case EquipmentTypes.weaponMelee: {
      const type2 = WeaponTypeIdSchema.parse(params.type2);
      if (type2 === "basic" || type2 === "advanced") {
        return Response.json((await data.getAll()).filter((e) => e.weaponType === type2));
      }
      break;
    }

    case EquipmentTypes.weaponRanged:
    case EquipmentTypes.weaponGrenade:
    default:
  }

  return NextResponse.error();
}
