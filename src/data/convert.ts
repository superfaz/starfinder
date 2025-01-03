import * as c from "chain-of-actions";
import {
  abilityScoreService,
  alignmentService,
  armorTypeService,
  avatarService,
  bodyPartService,
  bonusCategoryService,
  bookService,
  classService,
  criticalHitEffectService,
  damageTypeService,
  equipmentMaterialService,
  featTemplateService,
  professionService,
  originService,
  savingThrowService,
  sizeService,
  skillService,
  spellService,
  themeService,
  weaponCategoryService,
  weaponSpecialPropertyService,
  weaponTypeService,
} from "logic/server";
import { IDataSource } from "./interfaces";
import { IClientDataSet } from "./IClientDataSet";

export async function convert(dataSource: IDataSource): Promise<IClientDataSet> {
  const action = await c
    .start()
    .withContext({ dataSource: dataSource })
    .add(c.onSuccess(() => c.succeed({})))
    .add(c.addDataGrouped(abilityScoreService.retrieveAll))
    .add(c.addDataGrouped(alignmentService.retrieveAll))
    .add(c.addDataGrouped(armorTypeService.retrieveAll))
    .add(c.addDataGrouped(avatarService.retrieveAll))
    .add(c.addDataGrouped(bodyPartService.retrieveAll))
    .add(c.addDataGrouped(bonusCategoryService.retrieveAll))
    .add(c.addDataGrouped(bookService.retrieveAll))
    .add(c.addDataGrouped(classService.retrieveAll))
    .add(c.addDataGrouped(criticalHitEffectService.retrieveAll))
    .add(c.addDataGrouped(damageTypeService.retrieveAll))
    .add(c.addDataGrouped(equipmentMaterialService.retrieveAll))
    .add(c.addDataGrouped(featTemplateService.retrieveAll))
    .add(c.addDataGrouped(professionService.retrieveAll))
    .add(c.addDataGrouped(originService.retrieveAll))
    .add(c.addDataGrouped(savingThrowService.retrieveAll))
    .add(c.addDataGrouped(sizeService.retrieveAll))
    .add(c.addDataGrouped(skillService.retrieveAll))
    .add(c.addDataGrouped(spellService.retrieveAll))
    .add(c.addDataGrouped(themeService.retrieveAll))
    .add(c.addDataGrouped(weaponCategoryService.retrieveAll))
    .add(c.addDataGrouped(weaponSpecialPropertyService.retrieveAll))
    .add(c.addDataGrouped(weaponTypeService.retrieveAll))
    .runAsync();

  if (!action.success) {
    throw action.error;
  }

  return action.value;
}
