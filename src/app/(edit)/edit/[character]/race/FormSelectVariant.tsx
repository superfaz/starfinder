"use client";

import { ChangeEvent } from "react";
import { Form, Stack } from "react-bootstrap";
import { ReferenceComponent } from "app/components/ReferenceComponent";
import { displayBonus, findOrError } from "app/helpers";
import { Variant } from "model";
import { Badge } from "ui";
import { useStaticData } from "logic/StaticContext";

export default function FormSelectVariant({
  variants,
  value,
  onChange,
  children,
}: {
  variants: Variant[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
}) {
  const abilityScores = useStaticData().abilityScores;
  const selectedVariant = variants.find((v) => v.id === value);

  return (
    <>
      <Form.FloatingLabel controlId="variant" label="Variante" className="mt-3">
        <Form.Select value={value} onChange={onChange}>
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedVariant && Object.entries(selectedVariant.abilityScores).length > 0 && (
        <Stack direction="horizontal" className="right">
          {Object.entries(selectedVariant.abilityScores).map(
            ([key, value]) =>
              value && (
                <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                  {findOrError(abilityScores, key).code} {displayBonus(value)}
                </Badge>
              )
          )}
        </Stack>
      )}
      {children}
      {selectedVariant && selectedVariant.description && <p className="text-muted">{selectedVariant.description}</p>}
      {selectedVariant && selectedVariant.reference && <ReferenceComponent reference={selectedVariant.reference} />}
    </>
  );
}
