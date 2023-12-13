import { Badge, Card } from "react-bootstrap";
import { CharacterPresenter } from "logic";
import { Feature } from "model";
import ModifierComponent from "./ModifierComponent";

const categories: Record<string, string> = {
  ex: "EXT",
  ma: "MAG",
  su: "SUR",
};

const evolutionLabels: Record<string, string> = {
  bonus: "Bonus: +",
  damage: "Dégâts: ",
  distance: "Distance: ",
  strike: "Attaques: ",
  dice: "Dés: ",
};

function convertReplaceToText(character: CharacterPresenter, replace: string[]): string[] {
  return replace.map((id) => {
    const trait = character.getPrimaryRaceTraits().find((t) => t.id === id);
    const modifier = character
      .getPrimaryRaceTraits()
      .map((t) => t.modifiers)
      .flat()
      .find((c) => c.id === id);
    if (trait) {
      return trait.name;
    } else if (modifier) {
      return modifier.name || id;
    }
    return id;
  });
}

export default function FeatureComponent({
  character,
  feature,
  className,
  children,
}: {
  character: CharacterPresenter;
  feature: Feature;
  className?: string;
  children?: JSX.Element;
}): JSX.Element {
  const hasEvolutions = Object.keys(feature.evolutions).length > 0;
  return (
    <Card className={className}>
      <Card.Header>
        {children || feature.name}
        {feature.category && ` (${categories[feature.category]})`}
      </Card.Header>
      <Card.Body>
        {feature.replace.length > 0 && (
          <p>
            <span>Remplace : </span>
            {convertReplaceToText(character, feature.replace).join(", ")}
          </p>
        )}
        {feature.description && <p className="text-muted">{feature.description}</p>}
        {feature.modifiers &&
          feature.modifiers.map((modifier) => <ModifierComponent key={modifier.id} modifier={modifier} />)}
      </Card.Body>
      {hasEvolutions && (
        <Card.Footer>
          {Object.entries(feature.evolutions).map(([level, values]) => {
            if (Object.entries(values).length > 0) {
              return (
                <div key={level}>
                  <Badge bg="secondary">{level}</Badge> {values.name && <strong>{values.name}</strong>}{" "}
                  {Object.entries(values)
                    .filter(([key]) => key !== "name")
                    .map(([key, value]) => `${evolutionLabels[key]}${value}`)
                    .join(", ")}
                </div>
              );
            } else {
              return (
                <Badge key={level} bg="secondary">
                  {level}
                </Badge>
              );
            }
          })}
        </Card.Footer>
      )}
    </Card>
  );
}
