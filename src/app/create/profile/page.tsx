import { Col } from "react-bootstrap";
import { Profile } from "./Profile";
import { Avatar } from "./Avatar";
import { Description } from "./Description";

export default function Page() {
  return (
    <>
      <Col lg={3}>
        <Profile />
      </Col>
      <Col lg={3}>
        <Avatar />
      </Col>
      <Col lg={6}>
        <Description />
      </Col>
    </>
  );
}
