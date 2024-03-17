import { IDataSet, DataSetBuilder } from "data";
import { WeaponTypeIdSchema } from "model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const EquipmentTypeSchema = z.union([z.literal("weapon"), z.literal("armor"), z.literal("other")]);

export async function GET(_: NextRequest, { params }: { params: { type1: string; type2: string } }) {
  const builder: DataSetBuilder = new DataSetBuilder();
  const data: IDataSet = await builder.build();

  const type1 = EquipmentTypeSchema.parse(params.type1);
  if (type1 === "weapon") {
    const type2 = WeaponTypeIdSchema.parse(params.type2);

    switch (type2) {
      case "basic":
      case "advanced":
        return Response.json((await data.getEquipmentWeaponMelee()).filter((e) => e.weaponType === type2));
    }
  }

  return NextResponse.error();
}
