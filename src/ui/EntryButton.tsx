import clsx from "clsx";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

export function EntryButton({
  title,
  onClick,
  onInfoClick,
  selected = false,
  variant = "list",
  imagePath,
}: {
  title: string;
  onClick?: () => void;
  onInfoClick?: () => void;
  selected?: boolean;
  variant?: "list" | "selected";
  imagePath?: string;
}) {
  const icon = variant === "list" ? "bi bi-check-lg" : "bi bi-pencil-square";
  const buttonVariant = variant === "list" ? "primary" : "success";
  return (
    <Stack direction="horizontal" gap={2}>
      <Button
        className={clsx(["sf-select w-100", { selected }])}
        variant={"outline-" + buttonVariant}
        onClick={onClick}
      >
        <div className="sf-icon">
          <i className={icon}></i>
        </div>
        <div className="flex-grow-1 text-start">{title}</div>
        <div className="sf-picture">
          {imagePath && <Image src={imagePath} alt="" width={120} height={40} />}
          {!imagePath && <Image src="/race-unknown-mini.png" alt="" width={120} height={40} />}
        </div>
        <div className="sf-bg-plain"></div>
      </Button>
      {variant === "list" && (
        <Button
          variant={"link"}
          className={clsx("py-2", { invisible: !onInfoClick })}
          onClick={onInfoClick}
        >
          <i className="bi bi-info-circle"></i>
        </Button>
      )}
    </Stack>
  );
}
