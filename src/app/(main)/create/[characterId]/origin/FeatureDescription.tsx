import ModifierComponent from "app/components/ModifierComponent";
import { Badge } from "ui";
import type { Feature } from "view";

const evolutionLabels: Record<string, string> = {
  bonus: "Bonus: +",
  damage: "Dégâts: ",
  dice: "Dés: ",
  distance: "Distance: ",
  resistance: "Résistance: ",
  strike: "Attaques: ",
  usage: "Utilisations: ",
};

export default function FeatureDescription({ feature }: Readonly<{ feature: Feature }>): JSX.Element {
  const hasEvolutions = feature.source === "class" && Object.keys(feature.evolutions).length > 0;
  return (
    <>
      {feature.source === "origin" && feature.replace.length > 0 && (
        <p>
          <span>Remplace : </span>
          {feature.replace.map((r) => r.name).join(", ")}
        </p>
      )}
      {feature.description && <p className="text-muted">{feature.description}</p>}
      {feature.modifiers?.map((modifier) => <ModifierComponent key={modifier.id} modifier={modifier} />)}
      {hasEvolutions &&
        Object.entries(feature.evolutions).map(([level, values]) => {
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
    </>
  );
}
