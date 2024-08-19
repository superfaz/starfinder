import { Class } from "model";
import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

export function ClassSelection({
  classes,
  value,
  onChange,
  isInvalid,
}: {
  classes: Class[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isInvalid?: boolean;
}) {
  const selectedClass = classes.find((r) => r.id === value);

  return (
    <>
      <Form.FloatingLabel controlId="class" label="Classe">
        <Form.Select name="class" value={value} onChange={onChange} isInvalid={isInvalid}>
          {value === "" && <option value=""></option>}
          {classes.map((klass) => (
            <option key={klass.id} value={klass.id}>
              {klass.name}
            </option>
          ))}
        </Form.Select>
        <div className="invalid-feedback">Cette classe n&rsquo;est pas valide</div>
      </Form.FloatingLabel>
      <div className="text-muted">{selectedClass?.description}</div>
    </>
  );
}
