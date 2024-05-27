import { INamedModel } from "model";
import { ReactNode, useMemo } from "react";
import { Dropdown, Form } from "react-bootstrap";

export default function Typeahead<T extends INamedModel>(props: {
  controlId: string;
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  options?: T[];
}): ReactNode {
  const options = useMemo(() => {
    return (props.options ?? []).filter((option) => option.name.toLowerCase().includes(props.value.toLowerCase()));
  }, [props.value, props.options]);

  return (
    <Dropdown as={Form.FloatingLabel} controlId={props.controlId} label={props.label}>
      <Dropdown.Toggle
        as={Form.Control}
        id={undefined}
        value={props.value}
        onChange={(e) => props.onChange((e.target as HTMLInputElement).value)}
      />

      <Dropdown.Menu className="w-100">
        {options.map((option) => (
          <Dropdown.Item key={option.id} onClick={() => props.onChange(option.name)}>
            {option.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
