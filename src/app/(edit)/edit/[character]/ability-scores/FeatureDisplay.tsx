import { ChangeEvent } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ModifierComponent from "app/components/ModifierComponent";
import { CharacterPresenter, mutators, useAppDispatch, useAppSelector } from "logic";
import { ModifierTypes } from "model";
import type { Feat, Feature } from "view";
import { isFeat } from "view";

const categories: Record<string, string> = {
  ex: "EXT",
  ma: "MAG",
  su: "SUR",
};

const types: string[] = [
  ModifierTypes.classSkill,
  ModifierTypes.rankSkill,
  ModifierTypes.skill,
  ModifierTypes.skillTrained,
];

export function FeatureDisplay({
  presenter,
  feature,
}: Readonly<{ presenter: CharacterPresenter; feature: Feature | Feat }>) {
  const dispatch = useAppDispatch();
  const modifiers = feature.modifiers.filter((m) => types.includes(m.type));
  const skills = useAppSelector((state) => state.data.skills);
  const professions = presenter.getProfessionSkills();

  function handleLashuntaStudentSkill1(event: ChangeEvent<HTMLSelectElement>) {
    dispatch(mutators.updateLashuntaStudentSkill1(event.target.value));
  }

  function handleLashuntaStudentSkill2(event: ChangeEvent<HTMLSelectElement>) {
    dispatch(mutators.updateLashuntaStudentSkill2(event.target.value));
  }

  function handleShirrenObsessionSkill(event: ChangeEvent<HTMLSelectElement>) {
    dispatch(mutators.updateShirrenObsessionSkill(event.target.value));
  }

  function handleHalforcProfession(event: ChangeEvent<HTMLSelectElement>) {
    dispatch(mutators.updateHalforcProfession(event.target.value));
  }

  function handleThemelessSkill(event: ChangeEvent<HTMLSelectElement>) {
    dispatch(mutators.updateThemelessSkill(event.target.value));
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
      {feature.id === "student" && (
        <Card.Footer>
          <Form.FloatingLabel controlId="lashuntaStudent1" label="Première compétence sélectionnée">
            <Form.Select value={presenter.getLashuntaStudentSkill1() ?? ""} onChange={handleLashuntaStudentSkill1}>
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
          <Form.FloatingLabel controlId="lashuntaStudent2" label="Seconde compétence sélectionnée">
            <Form.Select value={presenter.getLashuntaStudentSkill2() ?? ""} onChange={handleLashuntaStudentSkill2}>
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
      {feature.id === "558ae3e2-3749-4234-bd70-9c7ce766ba10" && (
        <Card.Footer>
          <Form.FloatingLabel controlId="halforcProfession" label="Profession sélectionnée">
            <Form.Select value={presenter.getHalforcProfession() ?? ""} onChange={handleHalforcProfession}>
              <option value="" disabled>
                Aucune
              </option>
              {professions.map((profession) => (
                <option key={profession.id} value={profession.id}>
                  {profession.fullName}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
        </Card.Footer>
      )}
      {feature.id === "themeless-general-knowledge" && (
        <Card.Footer>
          <Form.FloatingLabel controlId="themelessSkill" label="Compétence de classe sélectionnée">
            <Form.Select value={presenter.getThemelessSkill() ?? ""} onChange={handleThemelessSkill}>
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
