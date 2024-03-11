import { Col } from "react-bootstrap";
import { EquipmentSelected } from "./EquipmentSelected";
import { EquipmentSelection } from "./EquipmentSelection";

export default function Page() {
  return (
    <>
      <Col lg={3}>
        <EquipmentSelected />
      </Col>
      <Col>
        <EquipmentSelection />
      </Col>
    </>
  );
}
