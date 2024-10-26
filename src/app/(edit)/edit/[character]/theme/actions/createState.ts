"use server";

import { DataSource } from "data";
import { CharacterPresenter } from "logic/server";
import { AbilityScoreId, Character, Profession } from "model";
import { Feature } from "view";

export interface UpdateState {
  theme?: string;
  features: Feature[];
  iconProfession?: Profession;
  iconAllProfessions: Profession[];
  themelessAbilityScore?: AbilityScoreId;
  scholarSkill?: string;
  scholarSpecialization?: string;
}

export async function createState(character: Character): Promise<UpdateState> {
  const presenter = new CharacterPresenter(new DataSource(), character);
  const features = await presenter.getThemeFeatures();
  const iconProfession = await presenter.getIconProfession();
  const iconAllProfessions = await presenter.getAllProfessions();
  const themelessAbilityScore = await presenter.getThemelessAbilityScore();
  const scholarSkill = await presenter.getScholarSkill();
  const scholarSpecialization = await presenter.getScholarSpecialization();

  return {
    theme: character.theme,
    features: features.success ? features.value : [],
    iconProfession: iconProfession.success ? iconProfession.value : undefined,
    iconAllProfessions: iconAllProfessions.success ? iconAllProfessions.value : [],
    themelessAbilityScore: themelessAbilityScore.success ? themelessAbilityScore.value : undefined,
    scholarSkill: scholarSkill.success ? scholarSkill.value : undefined,
    scholarSpecialization: scholarSpecialization.success ? scholarSpecialization.value : undefined,
  };
}
