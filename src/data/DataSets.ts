import {
  EquipmentWeaponMeleeSchema,
  EquipmentWeaponMelee,
  EquipmentWeaponRangedSchema,
  EquipmentWeaponRanged,
  EquipmentWeaponGrenadeSchema,
  EquipmentWeaponGrenade,
  EquipmentWeaponSolarian,
  EquipmentWeaponSolarianSchema,
  EquipmentWeaponAmmunition,
  EquipmentWeaponAmmunitionSchema,
  EquipmentWeaponFusionSchema,
  EquipmentWeaponFusion,
  EquipmentArmorHeavy,
  EquipmentArmorLight,
  EquipmentArmorLightSchema,
  EquipmentArmorHeavySchema,
  EquipmentArmorPoweredSchema,
  EquipmentArmorPowered,
  EquipmentArmorUpgradeSchema,
  EquipmentArmorUpgrade,
  EquipmentAugmentationSchema,
  EquipmentAugmentation,
} from "model";
import { IStaticDescriptor } from "./interfaces";

const StaticDataSets = {
  EquipmentArmorsLight: {
    mode: "static",
    type: "simple",
    name: "equipment-armors-light",
    schema: EquipmentArmorLightSchema,
  } as IStaticDescriptor<EquipmentArmorLight>,
  EquipmentArmorsHeavy: {
    mode: "static",
    type: "simple",
    name: "equipment-armors-heavy",
    schema: EquipmentArmorHeavySchema,
  } as IStaticDescriptor<EquipmentArmorHeavy>,
  EquipmentArmorsPowered: {
    mode: "static",
    type: "simple",
    name: "equipment-armors-powered",
    schema: EquipmentArmorPoweredSchema,
  } as IStaticDescriptor<EquipmentArmorPowered>,
  EquipmentArmorsUpgrade: {
    mode: "static",
    type: "simple",
    name: "equipment-armors-upgrades",
    schema: EquipmentArmorUpgradeSchema,
  } as IStaticDescriptor<EquipmentArmorUpgrade>,
  EquipmentOtherAugmentations: {
    mode: "static",
    type: "simple",
    name: "equipment-others-augmentations",
    schema: EquipmentAugmentationSchema,
  } as IStaticDescriptor<EquipmentAugmentation>,
  EquipmentWeaponsBasic: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-basic",
    schema: EquipmentWeaponMeleeSchema,
  } as IStaticDescriptor<EquipmentWeaponMelee>,
  EquipmentWeaponsAdvanced: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-advanced",
    schema: EquipmentWeaponMeleeSchema,
  } as IStaticDescriptor<EquipmentWeaponMelee>,
  EquipmentWeaponsSmall: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-small",
    schema: EquipmentWeaponRangedSchema,
  } as IStaticDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponsLong: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-long",
    schema: EquipmentWeaponRangedSchema,
  } as IStaticDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponsHeavy: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-heavy",
    schema: EquipmentWeaponRangedSchema,
  } as IStaticDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponsSniper: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-sniper",
    schema: EquipmentWeaponRangedSchema,
  } as IStaticDescriptor<EquipmentWeaponRanged>,
  EquipmentWeaponsGrenade: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-grenade",
    schema: EquipmentWeaponGrenadeSchema,
  } as IStaticDescriptor<EquipmentWeaponGrenade>,
  EquipmentWeaponsSolarian: {
    mode: "static",
    type: "simple",
    name: "equipment-weapons-solarian",
    schema: EquipmentWeaponSolarianSchema,
  } as IStaticDescriptor<EquipmentWeaponSolarian>,
  EquipmentWeaponsAmmunition: {
    mode: "static",
    type: "named",
    name: "equipment-weapons-ammunition",
    schema: EquipmentWeaponAmmunitionSchema,
  } as IStaticDescriptor<EquipmentWeaponAmmunition>,
  EquipmentWeaponsFusions: {
    mode: "static",
    type: "named",
    name: "equipment-weapons-fusion",
    schema: EquipmentWeaponFusionSchema,
  } as IStaticDescriptor<EquipmentWeaponFusion>,
};

export const DataSets = { ...StaticDataSets };
