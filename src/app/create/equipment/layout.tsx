"use client";

import { useParams } from "next/navigation";
import { ReactNode } from "react";
import { Col } from "react-bootstrap";
import { EquipmentSelected } from "./EquipmentSelected";
import { useCharacterPresenter } from "../helpers";

export default function Layout({ children }: { children: ReactNode }) {
  const presenter = useCharacterPresenter();
  const params = useParams<{ id: string }>();

  if (presenter.getRace() === null || presenter.getTheme() === null || presenter.getClass() === null) {
    return null;
  }

  return (
    <>
      <Col lg={3}>
        <EquipmentSelected selected={params.id} />
      </Col>
      <Col>{children}</Col>
    </>
  );
}
