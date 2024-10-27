"use server";

import { DataSource } from "data";
import { CharacterPresenter } from "logic/server";
import { Character, Class, IModel } from "model";
import { ClassFeature } from "view";

export interface UpdateState {
  class?: Class;
  details?: IModel;
  features: ClassFeature[];
  envoySkill?: string;
  mechanicStyle?: string;
  mysticConnection?: string;
  operativeSpecialization?: string;
  solarianColor?: string;
  solarianDamageType?: string;
  solarianManifestation?: string;
  soldierAbilityScore?: string;
  soldierPrimaryStyle?: string;
}

export async function createState(character: Character): Promise<UpdateState> {
  const presenter = new CharacterPresenter(new DataSource(), character);

  const klass = await presenter.getClass();
  const details = await presenter.getClassDetails();
  const features = await presenter.getClassFeatures();

  return {
    class: klass.success ? klass.value : undefined,
    details: details.success ? details.value : undefined,
    features: features.success ? features.value : [],
    envoySkill: presenter.getEnvoySkill(),
    mechanicStyle: presenter.getMechanicStyle(),
    mysticConnection: presenter.getMysticConnection(),
    operativeSpecialization: presenter.getOperativeSpecialization(),
    solarianColor: presenter.getSolarianColor(),
    solarianDamageType: presenter.getSolarianDamageType(),
    solarianManifestation: presenter.getSolarianManifestation(),
    soldierAbilityScore: presenter.getSoldierAbilityScore(),
    soldierPrimaryStyle: presenter.getSoldierPrimaryStyle(),
  };
}
