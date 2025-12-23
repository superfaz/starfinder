import { useParams } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { ActionErrors } from "app/helpers-server";
import { useStaticData } from "logic/StaticContext";
import { IdSchema, type ThemeScholar } from "model";
import SimpleTypeahead from "ui/SimpleTypeahead";
import { updateScholarSkill, UpdateScholarSkillInput, updateScholarSpecialization, UpdateState } from "./actions";
import ThemeScholarLoading from "./ThemeScholarLoading";

function useThemeDetails() {
  const [details, setDetails] = useState<ThemeScholar | null>(null);
  useEffect(() => {
    fetch("/api/themes/scholar")
      .then((response) => response.json())
      .then((data) => setDetails(data));
  }, []);

  return details;
}

export default function ThemeScholarEditor({
  state,
  setState,
}: Readonly<{
  state: UpdateState;
  setState: Dispatch<SetStateAction<UpdateState>>;
}>) {
  const skills = useStaticData().skills;
  const themeDetails = useThemeDetails();
  const { character } = useParams();
  const [skillErrors, setSkillErrors] = useState<ActionErrors<UpdateScholarSkillInput>>({});
  const [, setSpecializationErrors] = useState<ActionErrors<UpdateScholarSkillInput>>({});

  const characterId = IdSchema.parse(character);

  if (!themeDetails) {
    return <ThemeScholarLoading />;
  }

  async function handleScholarSkillChange(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const skillId = e.target.value;
    const result = await updateScholarSkill({ characterId, skillId });
    if (result.success) {
      setState(result);
    } else {
      setSkillErrors(result.errors);
    }
  }

  async function handleSpecializationChange(value: string): Promise<void> {
    const result = await updateScholarSpecialization({ characterId, specialization: value });
    if (result.success) {
      setState(result);
    } else {
      setSpecializationErrors(result.errors);
    }
  }

  return (
    <>
      <Form.FloatingLabel controlId="scholarSkill" label="Compétence de classe" className="mt-3">
        <Form.Select
          value={state.scholarSkill ?? ""}
          onChange={handleScholarSkillChange}
          isInvalid={!!skillErrors.skillId}
        >
          {skills
            .filter((s) => s.id === "life" || s.id === "phys")
            .map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
        </Form.Select>
      </Form.FloatingLabel>

      <SimpleTypeahead
        controlId="scholarSpecialization"
        label="Spécialité"
        value={state.scholarSpecialization ?? ""}
        onChange={handleSpecializationChange}
        disabled={!state.scholarSkill}
        options={state.scholarSkill ? themeDetails.values[state.scholarSkill] : []}
      />
    </>
  );
}
