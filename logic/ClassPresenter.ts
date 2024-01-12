import { CharacterPresenter } from "./CharacterPresenter";
import { ClassOperative, FeatureTemplate } from "model";

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
