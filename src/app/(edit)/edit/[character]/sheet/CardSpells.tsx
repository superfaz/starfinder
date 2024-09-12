import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { Badge } from "ui";
import { CharacterProps } from "../Props";

export function CardSpells({ presenter }: CharacterProps) {
  const spellsByLevel = presenter.getSelectedSpells();
  const isSpellCaster: boolean = presenter.getClass()?.spellCaster ?? false;
  const levels = [0, 1, 2, 3, 4, 5, 6];
  if (!isSpellCaster) {
    return null;
  }

  const spellsCount = Object.values(spellsByLevel).reduce((acc, level) => acc + level.length, 0);

  return (
    <Card data-testid="sheet-spells">
      <Card.Header>
        <Badge bg="primary">Sorts</Badge>
      </Card.Header>
      <Card.Body className="small">
        <Stack gap={2}>
          {spellsCount === 0 && <em>Pas de sort sélectionné</em>}
          {levels.map((level) => {
            const spells = spellsByLevel[level];
            if (spells !== undefined && spells.length > 0) {
              return (
                <>
                  <Badge bg="secondary" className="me-auto">
                    Niv. {level}
                  </Badge>
                  {spells.map((spell) => (
                    <div key={spell.id}>{spell.name}</div>
                  ))}
                </>
              );
            }
          })}
        </Stack>
      </Card.Body>
    </Card>
  );
}
