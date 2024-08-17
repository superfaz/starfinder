import Link from "next/link";
import { ChangeEvent } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { mutators, useAppDispatch } from "logic";
import { EquipmentArmor, ArmorEquipmentDescriptor } from "model";
import { useEquipment } from "../GenericEquipmentDisplay";

export function ArmorPage({ descriptor }: Readonly<{ descriptor: ArmorEquipmentDescriptor }>) {
  const dispatch = useAppDispatch();
  const equipment = useEquipment<EquipmentArmor>(descriptor);

  if (equipment === null) {
    return null;
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(mutators.updateEquipmentName({ id: descriptor.id, name: event.target.value }));
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(mutators.updateEquipmentDescription({ id: descriptor.id, description: event.target.value }));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <Link href="/edit/equipment" className="btn btn-primary me-auto">
        <i className="bi bi-chevron-left"></i> Retour à la sélection
      </Link>

      <h4 className="mt-3">Informations Générales</h4>
      <Row>
        <Col>
          <Stack direction="vertical" gap={2}>
            <Form.FloatingLabel controlId="name" label="Nom personnalisé" className="form-floating-always">
              <Form.Control
                type="text"
                placeholder={equipment.name}
                value={descriptor.name ?? ""}
                onChange={handleNameChange}
              />
            </Form.FloatingLabel>
          </Stack>
        </Col>
        <Col>
          <Form.FloatingLabel controlId="description" label="Description personnalisé" className="h-100">
            <Form.Control
              as="textarea"
              aria-label="Description personnalisée"
              value={descriptor.description ?? ""}
              onChange={handleDescriptionChange}
              style={{ height: "100%", minHeight: "100%" }}
            />
          </Form.FloatingLabel>
        </Col>
      </Row>
    </Stack>
  );
}
