import { Form } from "react-bootstrap";

export default function ThemeScholarLoading() {
  return (
    <>
      <Form.FloatingLabel controlId="scholarSkill" label="Compétence de classe" className="mt-3">
        <Form.Select disabled></Form.Select>
      </Form.FloatingLabel>

      <Form.FloatingLabel controlId="scholarSpecialization" label="Spécialité" className="mt-3">
        <Form.Control disabled></Form.Control>
      </Form.FloatingLabel>
    </>
  );
}
