import { start } from "chain-of-actions";
import {
  retrieveAbilityScores,
  retrieveAlignments,
  retrieveArmorTypes,
  retrieveAvatars,
  retrieveBodyParts,
  retrieveBonusCategories,
  retrieveBooks,
  retrieveClasses,
  retrieveCriticalHitEffects,
  retrieveDamageTypes,
  retrieveEquipmentMaterials,
  retrieveFeats,
  retrieveProfessions,
  retrieveRaces,
  retrieveSavingThrows,
  retrieveSizes,
  retrieveSkills,
  retrieveSpells,
  retrieveThemes,
  retrieveWeaponCategories,
  retrieveWeaponSpecialProperties,
  retrieveWeaponTypes,
} from "logic/server";
import { IDataSource } from "./interfaces";
import { IClientDataSet } from "./IClientDataSet";

export async function convert(dataSource: IDataSource): Promise<IClientDataSet> {
  const action = await start({}, { dataSource })
    .addData((_, context) => retrieveAbilityScores(context))
    .addData((_, context) => retrieveAlignments(context))
    .addData((_, context) => retrieveArmorTypes(context))
    .addData((_, context) => retrieveAvatars(context))
    .addData((_, context) => retrieveBodyParts(context))
    .addData((_, context) => retrieveBonusCategories(context))
    .addData((_, context) => retrieveBooks(context))
    .addData((_, context) => retrieveClasses(context))
    .addData((_, context) => retrieveCriticalHitEffects(context))
    .addData((_, context) => retrieveDamageTypes(context))
    .addData((_, context) => retrieveEquipmentMaterials(context))
    .addData((_, context) => retrieveFeats(context))
    .addData((_, context) => retrieveProfessions(context))
    .addData((_, context) => retrieveRaces(context))
    .addData((_, context) => retrieveSavingThrows(context))
    .addData((_, context) => retrieveSizes(context))
    .addData((_, context) => retrieveSkills(context))
    .addData((_, context) => retrieveSpells(context))
    .addData((_, context) => retrieveThemes(context))
    .addData((_, context) => retrieveWeaponCategories(context))
    .addData((_, context) => retrieveWeaponSpecialProperties(context))
    .addData((_, context) => retrieveWeaponTypes(context))
    .runAsync();

  if (!action.success) {
    throw action.error;
  }

  return action.value;
}
