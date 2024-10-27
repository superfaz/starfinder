import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Form } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { ActionErrors } from "app/helpers-server";
import { useStaticData } from "logic/StaticContext";
import { ClassEnvoy } from "model";
import { useCharacterId } from "../helpers-client";
import { updateEnvoySkill, UpdateEnvoySkillInput, UpdateState } from "./actions";

export default function EnvoyEditor({
  state,
  setState,
}: Readonly<{ state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>): ReactNode {
  const characterId = useCharacterId();
  const classDetails = state.details as ClassEnvoy | undefined;
  const skills = useStaticData().skills;
  const [errors, setErrors] = useState<ActionErrors<UpdateEnvoySkillInput>>({});

  if (!classDetails) {
    return null;
  }

  const envoySkills = classDetails.skills.map((skill) => findOrError(skills, skill));

  async function handleSkillChange(e: ChangeEvent<HTMLSelectElement>) {
    const skillId = e.target.value;
    const result = await updateEnvoySkill({ characterId, skillId });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <Form.FloatingLabel controlId="mysticConnection" label="Maîtrise de compétence">
      <Form.Select value={state.envoySkill ?? ""} onChange={handleSkillChange} isInvalid={!!errors.skillId}>
        {envoySkills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </Form.Select>
    </Form.FloatingLabel>
  );
}
