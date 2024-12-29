import { IEntry } from "model";
import { EntryButton } from "./EntryButton";
import Stack from "react-bootstrap/Stack";

export function EntryListComponent({
  entry,
  selectedId,
  onClick,
  hasInfo,
  infoId,
  setInfoId,
  children,
}: {
  entry: IEntry;
  selectedId?: string;
  onClick: () => void;
  hasInfo: boolean;
  infoId?: string;
  setInfoId: (infoId: string | undefined) => void;
  children?: React.ReactNode;
}) {
  function handleInfoClick() {
    setInfoId(infoId === entry.id ? undefined : entry.id);
  }

  return (
    <>
      <EntryButton
        title={entry.name}
        imagePath={undefined}
        selected={entry.id === selectedId}
        onClick={onClick}
        onInfoClick={hasInfo ? () => handleInfoClick() : undefined}
      />
      {infoId === entry.id && (
        <Stack direction="vertical" gap={2} className="mb-4">
          {children}
        </Stack>
      )}
    </>
  );
}
