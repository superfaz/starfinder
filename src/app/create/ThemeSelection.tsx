import type { Book, IEntry } from "model";
import type { ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { ReferenceComponent } from "./ReferenceComponent";

export function ThemeSelection({
  books,
  themes,
  value,
  onChange,
  isInvalid,
}: Readonly<{
  books: Book[];
  themes: IEntry[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isInvalid?: boolean;
}>) {
  const selectedTheme = themes.find((r) => r.id === value);

  return (
    <>
      <Form.FloatingLabel controlId="theme" label="Thème">
        <Form.Select name="theme" value={value} onChange={onChange} isInvalid={isInvalid} aria-invalid={isInvalid}>
          {value === "" && <option value=""></option>}
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </Form.Select>
        <div className="invalid-feedback">Ce thème n&rsquo;est pas valide</div>
      </Form.FloatingLabel>
      {selectedTheme && <div className="text-muted">{selectedTheme?.description}</div>}
      {selectedTheme && <ReferenceComponent books={books} reference={selectedTheme.reference} />}
    </>
  );
}
