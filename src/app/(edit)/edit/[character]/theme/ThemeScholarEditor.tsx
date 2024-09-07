import { ChangeEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import type { ThemeScholar } from "model";
import { CharacterProps } from "../Props";
import ThemeScholarLoading from "./ThemeScholarLoading";
import SimpleTypeahead from "app/components/SimpleTypeahead";

function useThemeDetails() {
  const [details, setDetails] = useState<ThemeScholar | null>(null);
  useEffect(() => {
    fetch("/api/themes/scholar")
      .then((response) => response.json())
      .then((data) => setDetails(data));
  }, []);

  return details;
}

export default function ThemeScholarEditor({ presenter }: CharacterProps) {
  const skills = useAppSelector((state) => state.data.skills);
  const dispatch = useAppDispatch();
  const themeDetails = useThemeDetails();

  const selectedDetails = presenter.getScholarDetails();
  if (!selectedDetails || !themeDetails) {
    return <ThemeScholarLoading />;
  }

  const specialization = selectedDetails.specialization;

  function handleScholarSkillChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateScholarSkill(id));
  }

  function handleSpecializationChange(value: string): void {
    dispatch(mutators.updateScholarSpecialization(value));
  }

  return (
    <>
      <Form.FloatingLabel controlId="scholarSkill" label="Compétence de classe" className="mt-3">
        <Form.Select value={selectedDetails.skill} onChange={handleScholarSkillChange}>
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
        value={specialization}
        onChange={handleSpecializationChange}
        options={themeDetails.values[selectedDetails.skill]}
      />
    </>
  );
}
