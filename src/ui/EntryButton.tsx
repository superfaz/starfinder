import clsx from "clsx";
import Image from "next/image";
import Button from "react-bootstrap/Button";

export function EntryButton({
  title,
  variant,
  imagePath,
  onClick,
}: {
  title: string;
  variant: "standard" | "selected" | "edit" | "disabled";
  imagePath?: string;
  onClick?: () => void;
}) {
  const icon = {
    standard: "bi bi-check-lg",
    selected: "bi bi-check-lg",
    edit: "bi bi-pencil-square",
    disabled: "bi bi-x-lg",
  }[variant];
  const buttonVariant = {
    standard: "outline-primary",
    selected: "primary",
    edit: "success",
    disabled: "outline-secondary",
  }[variant];

  return (
    <Button
      className={clsx("sf-select w-100", variant)}
      variant={buttonVariant}
      onClick={onClick}
      disabled={variant === "disabled"}
    >
      <div className="sf-icon">
        <i className={icon}></i>
      </div>
      <div className="flex-grow-1 text-start">{title}</div>
      {imagePath && (
        <>
          <div className="sf-picture">
            <Image src={imagePath} alt="" width={120} height={40} />
          </div>
          <div className="sf-bg-plain"></div>
        </>
      )}
    </Button>
  );
}
