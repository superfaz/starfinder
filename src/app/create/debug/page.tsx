import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { Client } from "./Client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Debug",
};

export default function Page() {
  return (
    <Col lg={12}>
      <Client />
    </Col>
  );
}
