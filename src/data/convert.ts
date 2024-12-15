import * as c from "chain-of-actions";
import {
  classes,
  retrieveAbilityScores,
  retrieveAlignments,
  retrieveArmorTypes,
  retrieveAvatars,
  retrieveBodyParts,
  retrieveBonusCategories,
  retrieveBooks,
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
  const action = await c
    .start()
    .withContext({ dataSource: dataSource })
    .add(c.onSuccess(() => c.succeed({})))
    .add(c.addDataGrouped(retrieveAbilityScores))
    .add(c.addDataGrouped(retrieveAlignments))
    .add(c.addDataGrouped(retrieveArmorTypes))
    .add(c.addDataGrouped(retrieveAvatars))
    .add(c.addDataGrouped(retrieveBodyParts))
    .add(c.addDataGrouped(retrieveBonusCategories))
    .add(c.addDataGrouped(retrieveBooks))
    .add(c.addDataGrouped(classes.retrieveAll))
    .add(c.addDataGrouped(retrieveCriticalHitEffects))
    .add(c.addDataGrouped(retrieveDamageTypes))
    .add(c.addDataGrouped(retrieveEquipmentMaterials))
    .add(c.addDataGrouped(retrieveFeats))
    .add(c.addDataGrouped(retrieveProfessions))
    .add(c.addDataGrouped(retrieveRaces))
    .add(c.addDataGrouped(retrieveSavingThrows))
    .add(c.addDataGrouped(retrieveSizes))
    .add(c.addDataGrouped(retrieveSkills))
    .add(c.addDataGrouped(retrieveSpells))
    .add(c.addDataGrouped(retrieveThemes))
    .add(c.addDataGrouped(retrieveWeaponCategories))
    .add(c.addDataGrouped(retrieveWeaponSpecialProperties))
    .add(c.addDataGrouped(retrieveWeaponTypes))
    .runAsync();

  if (!action.success) {
    throw action.error;
  }

  return action.value;
}
