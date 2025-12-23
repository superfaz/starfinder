import Link from "next/link";
import { Accordion } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { EntryButton } from "ui";
import { OriginFeature } from "view";

export default function StepSelectAlternativeTraits({
  traits,
  secondaryTraits,
  selectedTraits,
  error,
  onSelect,
}: {
  traits: OriginFeature[];
  secondaryTraits: OriginFeature[];
  selectedTraits: string[];
  error: boolean;
  onSelect: (traitId: string, enable: boolean) => void;
}) {
  function isSelected(traitId: string) {
    return selectedTraits.includes(traitId);
  }

  function isSelectable(trait: OriginFeature) {
    return trait.replace.every((t) => selectedTraits.includes(t.id));
  }

  return (
    <section className="vstack gap-2 mb-3">
      <label>Choisir les traits d&apos;espèce</label>
      <div className="mt-2 text-muted">Traits de base</div>
      <Accordion flush>
        {traits.map((trait) => (
          <Accordion.Item key={trait.id} eventKey={trait.id}>
            <Accordion.Header as="div" className={isSelected(trait.id) ? "selected" : undefined}>
              {trait.name}
            </Accordion.Header>
            <Accordion.Body>{trait.description}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <div className="mt-2 text-muted">Traits alternatifs</div>
      {error && <Alert variant="warning">Le trait sélectionné n&apos;est pas valide.</Alert>}

      {secondaryTraits.map((trait) => (
        <EntryButton
          key={trait.id}
          title={trait.name}
          variant={isSelected(trait.id) ? "selected" : isSelectable(trait) ? "standard" : "disabled"}
          onClick={() => onSelect(trait.id, !isSelected(trait.id))}
        />
      ))}

      <Link className="ms-5 my-5 btn btn-primary" href=".">
        Revenir à la vue générale
      </Link>
    </section>
  );
}
