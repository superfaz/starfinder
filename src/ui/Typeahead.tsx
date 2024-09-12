import { INamedModel } from "model";
import { CSSProperties, ReactNode, useMemo } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";

function defaultFilter<T extends INamedModel>(options: T[], value: string): T[] {
  return options.filter((option) => option.name.toLowerCase().includes(value.toLowerCase()));
}

export default function Typeahead<T extends INamedModel>(
  props: Readonly<{
    controlId: string;
    label: string;
    value: string;
    onChange: (newValue: string) => void;
    disabled?: boolean;
    options?: T[];
    filter?: (options: T[], value: string) => T[];
    renderItem?: (item: T) => ReactNode;
    style?: CSSProperties;
  }>
): JSX.Element {
  const filter = props.filter ?? defaultFilter;
  const options = useMemo(() => {
    return filter(props.options ?? [], props.value ?? "");
  }, [filter, props.value, props.options]);

  return (
    <Dropdown as={Form.FloatingLabel} controlId={props.controlId} label={props.label} style={props.style}>
      <Dropdown.Toggle
        as={Form.Control}
        id={undefined}
        disabled={props.disabled}
        value={props.value}
        onChange={(e) => props.onChange((e.target as HTMLInputElement).value)}
      />

      {props.value && (
        <Button
          className="position-absolute top-0 bottom-0 mt-auto mb-auto text-white"
          variant="link"
          style={{ bottom: 0, right: 0, zIndex: 100 }}
          onClick={() => props.onChange("")}
        >
          <i className="bi bi-x-lg"></i>
        </Button>
      )}

      <Dropdown.Menu className="w-100">
        {options.length === 0 && (
          <Dropdown.Item onClick={() => props.onChange(props.value)}>Nouvelle entrée : {props.value}</Dropdown.Item>
        )}
        {options.map((option) => (
          <Dropdown.Item key={option.id} onClick={() => props.onChange(option.name)}>
            {!props.renderItem && option.name}
            {props?.renderItem?.(option)}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
