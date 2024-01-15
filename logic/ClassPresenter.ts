import { CharacterPresenter } from "./CharacterPresenter";
import { ClassOperative, ClassSoldier, FeatureTemplate } from "model";

export function getOperativeFeatureTemplates(
  operativeData: ClassOperative,
  character: CharacterPresenter
): FeatureTemplate[] {
  const specialization = character.getOperativeSpecialization();
  if (!specialization) {
    return [];
  }

  const selectedSpecialization = operativeData.specializations.find((s) => s.id === specialization);
  const classFeatures: FeatureTemplate[] = operativeData.features;
  const specializationFeatures: FeatureTemplate[] = selectedSpecialization?.features ?? [];
  const features: FeatureTemplate[] = [...classFeatures, ...specializationFeatures];

  return features;
}

export function getSoldierFeatureTemplates(
  classDetails: ClassSoldier,
  character: CharacterPresenter
): FeatureTemplate[] {
  const primaryStyle = character.getSoldierPrimaryStyle();
  if (!primaryStyle) {
    return [];
  }

  const selectedStyle = classDetails.styles.find((s) => s.id === primaryStyle);
  const classFeatures: FeatureTemplate[] = classDetails.features;
  const specializationFeatures: FeatureTemplate[] = selectedStyle?.features ?? [];
  const features: FeatureTemplate[] = [...classFeatures, ...specializationFeatures];

  return features;
}
