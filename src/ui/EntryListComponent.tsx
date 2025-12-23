import clsx from "clsx";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { IEntry } from "model";
import { EntryButton } from "./EntryButton";

export function EntryListComponent({
  entry,
  variant = "standard",
  hasInfo = true,
  infoId,
  setInfoId,
  onClick,
  children,
}: {
  entry: IEntry;
  variant: "standard" | "selected" | "disabled";
  hasInfo: boolean;
  infoId?: string;
  setInfoId?: (infoId: string | undefined) => void;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  function handleInfoClick() {
    if (setInfoId === undefined) return;
    setInfoId(infoId === entry.id ? undefined : entry.id);
  }

  return (
    <>
      <Stack direction="horizontal" gap={2}>
        <EntryButton title={entry.name} imagePath={"/race-unknown-mini.png"} variant={variant} onClick={onClick} />
        {setInfoId !== undefined && (
          <Button variant="link" className={clsx("py-2", { invisible: !hasInfo })} onClick={handleInfoClick}>
            <i className="bi bi-info-circle"></i>
          </Button>
        )}
      </Stack>
      {infoId === entry.id && (
        <Stack direction="vertical" gap={2} className="mb-4">
          {children}
        </Stack>
      )}
    </>
  );
}
