import { useState } from "react";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

export function EquipmentSelected() {
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Armes</h2>
      <h2>Armures</h2>
      <h2>Autres</h2>
    </Stack>
  );
}

export function EquipmentSelection() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("weapon");

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Équipement disponible</h2>
      <Row className="mb-3 align-items-center">
        <Col xs="auto" className="ms-3">
          Filtres:
        </Col>
        <Col xs="auto">
          <ToggleButtonGroup type="radio" name="type" value={category} onChange={setCategory}>
            <ToggleButton id="category-general" value="weapon" variant="outline-secondary">
              Armes
            </ToggleButton>
            <ToggleButton id="category-all" value="armor" variant="outline-secondary">
              Armures
            </ToggleButton>
            <ToggleButton id="category-combat" value="other" variant="outline-secondary">
              Autres
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
        <Col>
          <FormControl
            type="search"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>
    </Stack>
  );
}
