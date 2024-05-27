import { INamedModel } from "model";
import { ReactNode, useMemo } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";

function defaultFilter<T extends INamedModel>(options: T[], value: string): T[] {
  return options.filter((option) => option.name.toLowerCase().includes(value.toLowerCase()));
}

export default function Typeahead<T extends INamedModel>(props: {
  controlId: string;
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  options?: T[];
  filter?: (options: T[], value: string) => T[];
  itemComponent?: (item: T) => ReactNode;
}): ReactNode {
  const filter = props.filter ?? defaultFilter;
  const options = useMemo(() => {
    return filter(props.options ?? [], props.value);
  }, [filter, props.value, props.options]);

  return (
    <Dropdown as={Form.FloatingLabel} controlId={props.controlId} label={props.label}>
      <Dropdown.Toggle
        as={Form.Control}
        id={undefined}
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
        {options.map((option) => (
          <Dropdown.Item key={option.id} onClick={() => props.onChange(option.name)}>
            {!props.itemComponent && option.name}
            {props.itemComponent && props.itemComponent(option)}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
