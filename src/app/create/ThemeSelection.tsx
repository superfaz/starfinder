import { Theme } from "model";
import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

export function ThemeSelection({
  themes,
  value,
  onChange,
  isInvalid,
}: {
  themes: Theme[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isInvalid?: boolean;
}) {
  const selectedTheme = themes.find((r) => r.id === value);

  return (
    <>
      <Form.FloatingLabel controlId="theme" label="Thème">
        <Form.Select name="theme" value={value} onChange={onChange} isInvalid={isInvalid}>
          {value === "" && <option value=""></option>}
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </Form.Select>
        <div className="invalid-feedback">Ce thème n&rsquo;est pas valide</div>
      </Form.FloatingLabel>
      <div className="text-muted">{selectedTheme?.description}</div>
    </>
  );
}
