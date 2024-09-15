import Card from "react-bootstrap/Card";
import ModifierComponent from "app/components/ModifierComponent";
import { CharacterPresenter } from "logic";
import { ModifierTypes, type FeatureCategory } from "model";
import { Badge } from "ui";
import type { Feature } from "view";

const categories: Record<FeatureCategory, string> = {
  ex: "EXT",
  ma: "MAG",
  su: "SUR",
};

const evolutionLabels: Record<string, string> = {
  bonus: "Bonus: +",
  damage: "Dégâts: ",
  dice: "Dés: ",
  distance: "Distance: ",
  resistance: "Résistance: ",
  strike: "Attaques: ",
  usage: "Utilisations: ",
};

/**
 * Converts a list of replace ids to a list of trait names.
 *
 * @param character - the character presenter
 * @param replace - the list of replace ids
 * @returns the list of trait names
 */
function convertReplaceToText(character: CharacterPresenter, replace: string[]): string[] {
  return replace.map((id) => {
    const trait = character.getPrimaryRaceTraits().find((t) => t.id === id);
    if (trait) {
      return trait.name;
    }

    const modifier = character
      .getPrimaryRaceTraits()
      .map((t) => t.modifiers)
      .flat()
      .find((c) => c.id === id);

    if (!modifier || (modifier.type !== ModifierTypes.ability && modifier.type !== ModifierTypes.savingThrow)) {
      return id;
    }

    return modifier.name;
  });
}

interface FeatureComponentProps {
  feature: Feature;
  className?: string;
  children?: JSX.Element;
}

export default function FeatureComponent({
  feature,
  className,
  children,
}: Readonly<FeatureComponentProps>): JSX.Element {
  const hasEvolutions = feature.source === "class" && Object.keys(feature.evolutions).length > 0;
  return (
    <Card className={className}>
      <Card.Header role="heading">
        {children ?? feature.name}
        {feature.category && ` (${categories[feature.category]})`}
      </Card.Header>
      <Card.Body>
        {feature.source === "race" && feature.replace.length > 0 && (
          <p>
            <span>Remplace : </span>
            {feature.replace.map((r) => r.name).join(", ")}
          </p>
        )}
        {feature.description && <p className="text-muted">{feature.description}</p>}
        {feature.modifiers?.map((modifier) => <ModifierComponent key={modifier.id} modifier={modifier} />)}
      </Card.Body>
      {hasEvolutions && (
        <Card.Footer>
          {Object.entries(feature.evolutions).map(([level, values]) => {
            if (values && Object.entries(values).length > 0) {
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
