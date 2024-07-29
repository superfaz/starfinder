import Col from "react-bootstrap/Col";
import { Profile } from "./Profile";
import { Avatar } from "./Avatar";
import { Description } from "./Description";

export function PageContent() {
  return (
    <>
      <Col xs={12} sm={6} md={4} lg={3} xl={2}>
        <Profile />
      </Col>
      <Col  xs={12} sm={6} md={4} lg={3} xl={2}>
        <Avatar />
      </Col>
      <Col  xs={12} sm={12} md={4} lg={6} xl={8}>
        <Description />
      </Col>
    </>
  );
}
