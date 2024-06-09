import { ChangeEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import type { ThemeScholar } from "model";
import { CharacterProps } from "../Props";

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
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();
  const themeDetails = useThemeDetails();

  const selectedDetails = presenter.getScholarDetails();

  if (data === null) {
    return <div>Loading...</div>;
  }

  function handleScholarSkillChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateScholarSkill(id));
  }

  function handleScholarSpecializationChange(e: ChangeEvent<HTMLSelectElement>): void {
    const specialization = e.target.value;
    dispatch(mutators.updateScholarSpecialization(specialization));
  }

  function handleScholarLabelChange(e: ChangeEvent<HTMLInputElement>): void {
    const label = e.target.value;
    dispatch(mutators.updateScholarSpecialization(label));
  }

  if (!selectedDetails || !themeDetails) {
    return null;
  }

  let specialization: string;
  let label: string;
  if (selectedDetails.specialization === "") {
    specialization = "";
    label = "";
  } else if (themeDetails.values[selectedDetails.skill].find((s) => s === selectedDetails.specialization)) {
    specialization = selectedDetails.specialization;
    label = "";
  } else {
    specialization = "other";
    label = selectedDetails.specialization === "other" ? "" : selectedDetails.specialization;
  }

  return (
    <>
      <Form.FloatingLabel controlId="scholarSkill" label="Compétence de classe" className="mt-3">
        <Form.Select value={selectedDetails.skill} onChange={handleScholarSkillChange}>
          {data.skills
            .filter((s) => s.id === "life" || s.id === "phys")
            .map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
        </Form.Select>
      </Form.FloatingLabel>
      <Form.FloatingLabel controlId="scholarSpecialization" label="Spécialité">
        <Form.Select value={specialization} onChange={handleScholarSpecializationChange}>
          <option value=""></option>
          {themeDetails.values[selectedDetails.skill].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
          <option value="other">Autre domaine</option>
        </Form.Select>
      </Form.FloatingLabel>
      <Form.FloatingLabel controlId="scholarLabel" label="Domaine de spécialité" hidden={specialization !== "other"}>
        <Form.Control type="text" value={label} onChange={handleScholarLabelChange} />
      </Form.FloatingLabel>
    </>
  );
}
