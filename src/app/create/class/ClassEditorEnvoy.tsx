import { ChangeEvent, ReactNode } from "react";
import { Form } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { ClassEnvoy } from "model";
import { useClassDetails } from "../helpers-client";
import { CharacterProps } from "../Props";

export default function EnvoyEditor({ presenter }: CharacterProps): ReactNode {
  const classDetails = useClassDetails<ClassEnvoy>("envoy");
  const skills = useAppSelector((state) => state.data.skills);
  const dispatch = useAppDispatch();

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const envoySkills = classDetails.skills.map((skill) => findOrError(skills, skill));

  const handleSkillChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(mutators.updateEnvoySkill(event.target.value));
  };

  return (
    <Form.FloatingLabel controlId="mysticConnection" label="Maîtrise de compétence">
      <Form.Select value={presenter.getEnvoySkill() ?? ""} onChange={handleSkillChange}>
        {envoySkills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </Form.Select>
    </Form.FloatingLabel>
  );
}
