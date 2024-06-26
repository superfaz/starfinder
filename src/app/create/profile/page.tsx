import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { Profile } from "./Profile";
import { Avatar } from "./Avatar";
import { Description } from "./Description";

export const metadata: Metadata = {
  title: "Définition du profil",
};

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
