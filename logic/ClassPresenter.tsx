import { CharacterPresenter } from "./CharacterPresenter";
import { FeatureTemplate } from "model";
import operativeData from "data/class-operative.json";

export function getOperativeFeatureTemplates(character: CharacterPresenter): FeatureTemplate[] {
  const specialization = character.getOperativeSpecialization();
  if (!specialization) {
    return [];
  }

  const selectedSpecialization = operativeData.specializations.find((s) => s.id === specialization);
  const classFeatures: FeatureTemplate[] = operativeData.features;
  const specializationFeatures: FeatureTemplate[] = selectedSpecialization?.features ?? [];
  const features: FeatureTemplate[] = classFeatures.concat(specializationFeatures);

  return features;
}
