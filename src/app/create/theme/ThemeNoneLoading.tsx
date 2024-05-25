import { Form } from "react-bootstrap";

export default function ThemeNoneLoading() {
  return (
    <Form.FloatingLabel controlId="noThemeAbility" label="Caractérisque du thème" className="mt-3">
      <Form.Select disabled></Form.Select>
    </Form.FloatingLabel>
  );
}
