import { Form } from "react-bootstrap";

export default function ThemelessLoading() {
  return (
    <Form.FloatingLabel controlId="themelessAbility" label="Caractérisque du thème" className="mt-3">
      <Form.Select disabled></Form.Select>
    </Form.FloatingLabel>
  );
}
