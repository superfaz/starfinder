import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { TabEditProps } from "../Props";

interface IThemeDetailsScholar {
  id: string;
  values: Record<string, string[]>;
}

function useThemeDetails(themeId: string) {
  const [details, setDetails] = useState<IThemeDetailsScholar | null>(null);
  useEffect(() => {
    if (themeId && details === null) {
      fetch("/api/themes/" + themeId)
        .then((response) => response.json())
        .then((data) => setDetails(data));
    }
  }, [themeId, details]);

  return details;
}

export default function ThemeScholarEditor({ data, character, mutators }: TabEditProps) {
  const selectedDetails = character.getScholarDetails();
  const themeDetails = useThemeDetails("scholar");

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

  if (!selectedDetails || !themeDetails) {
    return "loading...";
  }

  console.log(selectedDetails);
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
      <Form.FloatingLabel controlId="scholarSkill" label="Choix de la compétence de classe">
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
      <Form.FloatingLabel controlId="scholarSpecialization" label="Choix de la spécialité">
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
