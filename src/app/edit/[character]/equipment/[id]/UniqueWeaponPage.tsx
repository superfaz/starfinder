import Link from "next/link";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import {
  EquipmentWeapon,
  EquipmentWeaponFusion,
  EquipmentWeaponFusionSchema,
  WeaponEquipmentDescriptor,
  WeaponFusionCostByLevel,
} from "model";
import { useEquipment } from "../GenericEquipmentDisplay";

function useFusions(levelMax: number) {
  const [fusions, setFusions] = useState<EquipmentWeaponFusion[]>([]);

  useEffect(() => {
    if (levelMax === 0) {
      setFusions([]);
    }

    fetch(`/api/equipment/weapons/fusions`)
      .then((res) => res.json())
      .then((data) => {
        const fusions = EquipmentWeaponFusionSchema.array()
          .parse(data)
          .filter((fusion) => fusion.level <= levelMax)
          .sort((a, b) => a.level - b.level);
        setFusions(fusions);
      });
  }, [levelMax]);

  return fusions;
}

function FusionDisplay({
  fusion,
  children,
  selected,
}: Readonly<{
  fusion: EquipmentWeaponFusion;
  children: ReactNode;
  selected: boolean;
}>) {
  return (
    <Col key={fusion.id} className="mb-3">
      <Card className="h-100" border={selected ? "primary" : undefined}>
        <Card.Header className="d-flex align-items-center">
          {fusion.name}
          <Badge bg="primary" className="ms-2">
            Niv. {fusion.level}
          </Badge>
          {children}
        </Card.Header>
        <Card.Body className="small">
          {fusion.description}
          {fusion.constraint && (
            <>
              <hr />
              {fusion.constraint}
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}

export function UniqueWeaponPage({ descriptor }: Readonly<{ descriptor: WeaponEquipmentDescriptor }>) {
  const dispatch = useAppDispatch();
  const equipment = useEquipment<EquipmentWeapon>(descriptor);
  const materials = useAppSelector((state) => state.data.equipmentMaterials);
  const fusions = useFusions(equipment?.level ?? 0);

  if (equipment === null || fusions.length === 0) {
    return null;
  }

  if (
    descriptor.category !== "weapon" ||
    descriptor.type !== "unique" ||
    descriptor.secondaryType === "grenade" ||
    descriptor.secondaryType === "ammunition"
  ) {
    throw new Error("Invalid descriptor");
  }

  const selectedMaterial = materials.find((material) => material.id === descriptor.material);
  const appliedFusions = (descriptor.fusions ?? []).map((fusionId) => findOrError(fusions, (f) => f.id === fusionId));
  const remainingLevels = equipment.level - appliedFusions.reduce((acc, fusion) => acc + fusion.level, 0);
  const fusionCost = (WeaponFusionCostByLevel as Record<number, number>)[equipment.level];
  const potentialFusions = fusions
    .filter((fusion) => fusion.level <= remainingLevels)
    .filter((fusion) => !appliedFusions.includes(fusion));
  const materialDisabled = !["basic", "advanced"].includes(descriptor.secondaryType);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(mutators.updateEquipmentName({ id: descriptor.id, name: event.target.value }));
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(mutators.updateEquipmentDescription({ id: descriptor.id, description: event.target.value }));
  }

  function handleMaterialChange(event: ChangeEvent<HTMLSelectElement>) {
    dispatch(mutators.updateEquipmentMaterial({ id: descriptor.id, material: event.target.value }));
  }

  function handleAddFusion(id: string) {
    dispatch(mutators.addEquipmentFusion({ equipment: descriptor.id, id, cost: fusionCost }));
  }

  function handleRemoveFusion(id: string) {
    dispatch(mutators.removeEquipmentFusion({ equipment: descriptor.id, id, cost: fusionCost }));
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
            <Form.FloatingLabel controlId="material" label="Matériau">
              <Form.Select
                value={descriptor.material ?? "normal"}
                disabled={materialDisabled}
                onChange={handleMaterialChange}
              >
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} +{material.uniqueCost} Cr
                  </option>
                ))}
              </Form.Select>
            </Form.FloatingLabel>
            {selectedMaterial?.description && <div className="text-muted small">{selectedMaterial.description}</div>}
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
      <h4 className="mt-3">Fusions</h4>
      <Row>
        <Col sm={1}>
          <Form.Control type="number" value={remainingLevels} disabled className="text-center" />
        </Col>
        <Form.Label column>Niveaux disponibles</Form.Label>
        <Col sm={1}>
          <Form.Control type="number" value={fusionCost} disabled className="text-center" />
        </Col>
        <Form.Label column>Coût par fusion</Form.Label>
      </Row>
      <Row className="row-cols-3">
        {appliedFusions.map((fusion) => (
          <FusionDisplay key={fusion.id} fusion={fusion} selected={true}>
            <Button variant="primary" size="sm" className="ms-auto" onClick={() => handleRemoveFusion(fusion.id)}>
              Enlever
            </Button>
          </FusionDisplay>
        ))}
      </Row>
      <Row className="row-cols-3">
        {potentialFusions.map((fusion) => (
          <FusionDisplay key={fusion.id} fusion={fusion} selected={false}>
            <Button variant="primary" size="sm" className="ms-auto" onClick={() => handleAddFusion(fusion.id)}>
              Ajouter
            </Button>
          </FusionDisplay>
        ))}
      </Row>
    </Stack>
  );
}
