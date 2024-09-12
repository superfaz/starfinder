import { Card, Row, Stack } from "react-bootstrap";
import { DronePresenter, useAppSelector } from "logic";
import { type Alignment, AlignmentIds } from "model";
import { Badge } from "ui";
import { ValueComponent } from "../sheet/ValueComponent";

export function CardDroneProfile({ presenter }: Readonly<{ presenter: DronePresenter }>) {
  const alignments = useAppSelector((state) => state.data.alignments);
  const alignment: Alignment | undefined = alignments.find((a) => a.id === AlignmentIds.n);

  return (
    <Card data-testid="profile">
      <Card.Header>
        <Badge bg="primary">Profil</Badge>
      </Card.Header>
      <Card.Body>
        <Stack direction="vertical" gap={2}>
          <ValueComponent label="Nom du drone" value={presenter.getName()} />
          <Row>
            <ValueComponent label="Chassis" className="col-8" value={presenter.getChassis()?.name} />
            <ValueComponent label="Niveau" className="col-4" value={1} />
          </Row>
          <ValueComponent label="Race" value="Drone (Artificiel)" />
          <Row>
            <ValueComponent label="Taille" className="col" value={presenter.getSize()?.name} />
            <ValueComponent label="Vitesse" className="col" value={presenter.getSpeed() * 1.5 + " mètres"} />
          </Row>
          <Row>
            <ValueComponent
              label="Alignement"
              className="col-4"
              value={alignment?.code ?? ""}
              title={alignment?.name ?? undefined}
            />
          </Row>
        </Stack>
      </Card.Body>
    </Card>
  );
}
