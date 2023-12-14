import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { CharacterTabProps } from "../CharacterTabProps";

export default function ThemeScholarEditor({ data, character, mutators }: CharacterTabProps) {
  const scholarDetails = character.getScholarDetails();

  function handleScholarSkillChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    mutators.updateScholarSkill(id);
  }

  function handleScholarSpecializationChange(e: ChangeEvent<HTMLSelectElement>): void {
    const specialization = e.target.value;
    mutators.updateScholarSpecialization(specialization);
  }

  function handleScholarLabelChange(e: ChangeEvent<HTMLInputElement>): void {
    const label = e.target.value;
    mutators.updateScholarSpecialization(label);
  }

  if (!scholarDetails) {
    return null;
  }

  return (
    <>
      <Form.FloatingLabel controlId="scholarSkill" label="Choix de la compétence de classe">
        <Form.Select value={scholarDetails.skill} onChange={handleScholarSkillChange}>
          {data.skills
            .filter((s) => s.id === "life" || s.id === "phys")
            .map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
        </Form.Select>
      </Form.FloatingLabel>
      <Form.FloatingLabel controlId="scholarSpecialization" label="Choix de la spécialité">
        <Form.Select value={scholarDetails.specialization} onChange={handleScholarSpecializationChange}>
          {data.specials.scholar[scholarDetails.skill].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
          <option value="">Autre domaine</option>
        </Form.Select>
      </Form.FloatingLabel>
      <Form.FloatingLabel
        controlId="scholarLabel"
        label="Domaine de spécialité"
        hidden={scholarDetails.specialization !== ""}
      >
        <Form.Control type="text" value={scholarDetails.label} onChange={handleScholarLabelChange} />
      </Form.FloatingLabel>
    </>
  );
}
