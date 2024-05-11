import { ChangeEvent } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { EquipmentBase, EquipmentDescriptor } from "model";
import { useEquipment } from "../EquipmentDisplay";

export function WeaponPage({ descriptor }: { descriptor: EquipmentDescriptor }) {
  const dispatch = useAppDispatch();
  const equipment = useEquipment<EquipmentBase>(descriptor);
  const materials = useAppSelector((state) => state.data.equipmentMaterials);

  const selectedMaterial = materials.find((material) => material.id === descriptor.material);

  if (equipment === null) {
    return null;
  }

  function handleMaterialChange(event: ChangeEvent<HTMLSelectElement>) {
    dispatch(mutators.updateEquipmentMaterial({ id: descriptor.id, material: event.target.value }));
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(mutators.updateEquipmentName({ id: descriptor.id, name: event.target.value }));
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(mutators.updateEquipmentDescription({ id: descriptor.id, description: event.target.value }));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h4 className="mt-3">Informations Générales</h4>
      <Row>
        <Col>
          <Stack direction="vertical" gap={2}>
            <Form.FloatingLabel label="Nom personnalisé" className="form-floating-always">
              <Form.Control
                type="text"
                placeholder={equipment.name}
                value={descriptor.name ?? ""}
                onChange={handleNameChange}
              />
            </Form.FloatingLabel>
            <Form.FloatingLabel label="Matériau">
              <Form.Select value={descriptor.material ?? "normal"} onChange={handleMaterialChange}>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} +{material.uniqueCost} Cr
                  </option>
                ))}
              </Form.Select>
            </Form.FloatingLabel>
            {selectedMaterial && selectedMaterial.description && (
              <div className="text-muted small">{selectedMaterial.description}</div>
            )}
          </Stack>
        </Col>
        <Col>
          <Form.FloatingLabel label="Description personnalisé">
            <Form.Control
              as="textarea"
              aria-label="Description personnalisée"
              value={descriptor.description ?? ""}
              onChange={handleDescriptionChange}
              style={{ minHeight: "7.75em" }}
            />
          </Form.FloatingLabel>
        </Col>
      </Row>
      <h4 className="mt-3">Fusions</h4>
      <Row>
        <Col lg={3}></Col>
        <Col></Col>
      </Row>
    </Stack>
  );
}
