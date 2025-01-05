import Alert from "react-bootstrap/Alert";
import { useStaticData } from "logic/StaticContext";
import { EntryButton } from "ui";

export default function StepSelectAbilityScore({
  selectedId,
  error,
  onSelect,
}: {
  selectedId: string;
  error: boolean;
  onSelect: (id: string) => void;
}) {
  const abilityScores = useStaticData().abilityScores;

  return (
    <section className="vstack gap-2 mb-3">
      <label>Choisir la caractéristique renforcée</label>
      {error && <Alert variant="warning">La caractéristique sélectionnée n&apos;est pas valide.</Alert>}
      {abilityScores.map((abilityScore) => (
        <EntryButton
          key={abilityScore.id}
          title={abilityScore.name}
          imagePath={undefined}
          variant={abilityScore.id === selectedId ? "selected" : "standard"}
          onClick={() => onSelect(abilityScore.id)}
        />
      ))}
    </section>
  );
}
