import { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import { groupBy } from "app/helpers";
import { EntryButton } from "ui";
import { OriginEntry } from "view";

export default function StepSelectOrigin({
  origins,
  selectedId,
  error,
  onSelect,
}: {
  origins: OriginEntry[];
  selectedId: string;
  error: boolean;
  onSelect: (id: string) => void;
}) {
  const groups = groupBy(origins, (i) => i.category);
  return (
    <section className="vstack gap-2 mb-3">
      <label>Choisir une espèce</label>
      {error && <Alert variant="warning">L&apos;espèce sélectionnée n&apos;est pas valide.</Alert>}
      {Object.entries(groups).map(([groupName, origins]) => (
        <Fragment key={groupName}>
          <div className="mt-2 text-muted">{groupName}</div>
          {origins.map((origin) => (
            <EntryButton
              key={origin.id}
              title={origin.name}
              variant={origin.id === selectedId ? "selected" : "standard"}
              imagePath="/origin-unknown-mini.png"
              onClick={() => onSelect(origin.id)}
            />
          ))}
        </Fragment>
      ))}
    </section>
  );
}
