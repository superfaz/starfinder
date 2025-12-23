import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "ui";
import { useAppSelector } from "logic";
import { Alignment } from "model";
import { ValueComponent } from "./ValueComponent";
import { CharacterProps } from "../Props";

export function CardProfile({ presenter }: CharacterProps) {
  const alignments = useAppSelector((state) => state.data.alignments);
  const alignment: Alignment | undefined = alignments.find((a) => a.id === presenter.getAlignment());

  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Profil</Badge>
      </Card.Header>
      <Card.Body>
        <Stack direction="vertical" gap={2}>
          <ValueComponent label="Nom du personnage" value={presenter.getName()} />
          <Row>
            <ValueComponent label="Classe" className="col-8" value={presenter.getClass()?.name} />
            <ValueComponent label="Niveau" className="col-4" value={presenter.getCharacter().level} />
          </Row>
          <ValueComponent label="Race" value={presenter.getRace()?.name} />
          <ValueComponent label="Thème" value={presenter.getTheme()?.name} />
          <Row>
            <ValueComponent label="Taille" className="col" value={presenter.getSize().name} />
            <ValueComponent label="Vitesse" className="col" value={presenter.getSpeed() * 1.5 + " mètres"} />
            <ValueComponent label="Sexe" className="col-3" value={presenter.getSex()} />
          </Row>
          <ValueComponent label="Monde natal" value={presenter.getHomeWorld()} />
          <Row>
            <ValueComponent
              label="Alignement"
              className="col-4"
              value={alignment?.code ?? ""}
              title={alignment?.name ?? undefined}
            />
            <ValueComponent label="Divinité" className="col" value={presenter.getDeity()} />
          </Row>
        </Stack>
      </Card.Body>
    </Card>
  );
}
