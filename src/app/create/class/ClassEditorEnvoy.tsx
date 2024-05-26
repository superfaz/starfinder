import { ChangeEvent, ReactNode, useEffect } from "react";
import { CharacterProps } from "../Props";
import { ClassEnvoy } from "model";
import { mutators, retrieveClassDetails, useAppDispatch, useAppSelector, useClassDetails } from "logic";
import { findOrError } from "app/helpers";
import { Form } from "react-bootstrap";

export default function EnvoyEditor({ character }: CharacterProps): ReactNode {
  const classDetails = useClassDetails<ClassEnvoy>("envoy");
  const skills = useAppSelector((state) => state.data.skills);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails("envoy"));
    }
  }, [dispatch, classDetails]);

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const envoySkills = classDetails.skills.map((skill) => findOrError(skills, skill));

  const handleSkillChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(mutators.updateEnvoySkill(event.target.value));
  };

  return (
    <Form.FloatingLabel controlId="mysticConnection" label="Maîtrise de compétence">
      <Form.Select value={character.getEnvoySkill() ?? ""} onChange={handleSkillChange}>
        {envoySkills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </Form.Select>
    </Form.FloatingLabel>
  );
}
