import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { useAppSelector } from "logic";
import { Alignment } from "model";
import { ValueComponent } from "./ValueComponent";
import { CharacterProps } from "../Props";

export function CardProfile({ character }: CharacterProps) {
  const alignments = useAppSelector((state) => state.data.alignments);
  const alignment: Alignment | undefined = alignments.find((a) => a.id === character.getAlignment());

  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Profil</Badge>
      </Card.Header>
      <Card.Body>
        <Stack direction="vertical" gap={2}>
          <ValueComponent label="Nom du personnage" value={character.getName()} />
          <Row>
            <ValueComponent label="Classe" className="col-8" value={character.getClass()?.name} />
            <ValueComponent label="Niveau" className="col-4" value={character.getCharacter().level} />
          </Row>
          <ValueComponent label="Race" value={character.getRace()?.name} />
          <ValueComponent label="Thème" value={character.getTheme()?.name} />
          <Row>
            <ValueComponent label="Taille" className="col" value={character.getSize().name} />
            <ValueComponent label="Vitesse" className="col" value={character.getSpeed() * 1.5 + " mètres"} />
            <ValueComponent label="Sexe" className="col-3" value={character.getSex()} />
          </Row>
          <ValueComponent label="Monde natal" value={character.getHomeWorld()} />
          <Row>
            <ValueComponent
              label="Alignement"
              className="col-4"
              value={alignment?.code ?? ""}
              title={alignment?.name ?? undefined}
            />
            <ValueComponent label="Divinité" className="col" value={character.getDeity()} />
          </Row>
        </Stack>
      </Card.Body>
    </Card>
  );
}
