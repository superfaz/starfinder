import Alert from "react-bootstrap/Alert";
import { Variant } from "model";
import { EntryButton } from "ui";

export default function StepSelectVariant({
  variants,
  selectedId,
  error,
  onSelect,
}: {
  variants: Variant[];
  selectedId: string;
  error: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="vstack gap-2 mb-3">
      <label>Choisir une variante</label>
      {error && <Alert variant="warning">La variante sélectionnée n&apos;est pas valide.</Alert>}
      {variants.map((variant) => (
        <EntryButton
          key={variant.id}
          title={variant.name}
          variant={variant.id === selectedId ? "selected" : "standard"}
          onClick={() => onSelect(variant.id)}
        />
      ))}
    </section>
  );
}
