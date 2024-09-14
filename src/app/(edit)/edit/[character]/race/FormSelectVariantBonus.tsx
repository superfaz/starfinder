"use client";

import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useStaticData } from "logic/StaticContext";
import { Badge } from "ui";

export default function FormSelectVariantBonus({
  value,
  onChange,
}: Readonly<{
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}>): JSX.Element {
  const abilityScores = useStaticData().abilityScores;
  const selected = abilityScores.find((v) => v.id === value);

  return (
    <>
      <Form.FloatingLabel controlId="selectableBonus" label="Choix de la charactérisque">
        <Form.Select value={selected?.id || ""} onChange={onChange}>
          {abilityScores.map((abilityScore) => (
            <option key={abilityScore.id} value={abilityScore.id}>
              {abilityScore.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selected && (
        <Stack direction="horizontal" className="right">
          <Badge bg="primary">
            {selected.code}
            {" +2"}
          </Badge>
        </Stack>
      )}
    </>
  );
}
