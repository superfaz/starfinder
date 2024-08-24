import type { Book, IEntry } from "model";
import type { ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { ReferenceComponent } from "./ReferenceComponent";

export function ClassSelection({
  books,
  classes,
  value,
  onChange,
  isInvalid,
}: {
  books: Book[];
  classes: IEntry[];
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
      {selectedClass && <div className="text-muted">{selectedClass?.description}</div>}
      {selectedClass && <ReferenceComponent books={books} reference={selectedClass.reference} />}
    </>
  );
}
