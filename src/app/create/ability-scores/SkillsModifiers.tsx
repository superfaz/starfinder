import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { ModifierTypes, hasTarget } from "model";
import { type Feature, isFeat, Feat } from "view";
import { useCharacterPresenter } from "../helpers";
import ModifierComponent from "../ModifierComponent";
import { Form } from "react-bootstrap";
import { CharacterPresenter, mutators, useAppDispatch, useAppSelector } from "logic";

const categories: Record<string, string> = {
  ex: "EXT",
  ma: "MAG",
  su: "SUR",
};

const types: string[] = [ModifierTypes.skill, ModifierTypes.classSkill, ModifierTypes.rankSkill];

export function FeatureDisplay({
  presenter,
  feature,
}: Readonly<{ presenter: CharacterPresenter; feature: Feature | Feat }>) {
  const dispatch = useAppDispatch();
  const modifiers = feature.modifiers.filter((m) => types.includes(m.type));
  const skills = useAppSelector((state) => state.data.skills);

  function handleShirrenObsessionSkill(event: React.ChangeEvent<HTMLSelectElement>) {
    dispatch(mutators.updateShirrenObsessionSkill(event.target.value));
  }

  return (
    <Card>
      <Card.Header>
        {feature.name}
        {!isFeat(feature) && feature.category && ` (${categories[feature.category]})`}
      </Card.Header>
      <Card.Body>
        {modifiers.map((modifier) => (
          <ModifierComponent key={modifier.id} modifier={modifier} />
        ))}
      </Card.Body>
      {feature.id === "f46aaa34-1e74-4e7b-81d8-6f63883bd94e" && (
        <Card.Footer>
          <Form.FloatingLabel controlId="shirrenObsession" label="Compétence sélectionnée">
            <Form.Select value={presenter.getShirrenObsessionSkill() ?? ""} onChange={handleShirrenObsessionSkill}>
              <option value="" disabled>
                Aucune
              </option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
        </Card.Footer>
      )}
    </Card>
  );
}

export function SkillsModifiers() {
  const presenter = useCharacterPresenter();
  const features = [
    ...presenter.getSelectedRaceTraits().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...presenter.getThemeFeatures().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...presenter.getClassFeatures().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...presenter.getFeats().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
  ];
  return (
    <Stack direction="vertical" gap={2} data-testid="modifiers">
      <h2>Modificateurs</h2>
      {features.map((feature) => (
        <FeatureDisplay
          key={hasTarget(feature) ? feature.id + "-" + feature.target : feature.id}
          presenter={presenter}
          feature={feature}
        />
      ))}
    </Stack>
  );
}
