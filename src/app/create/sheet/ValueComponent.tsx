interface IValueComponentProps {
  label: string;
  value?: string | number;
  title?: string;
  className?: string;
  children?: JSX.Element[] | JSX.Element | false;
}

type ValueComponentProps = Readonly<IValueComponentProps>;

export function ValueComponent({ label, value, title, className, children }: ValueComponentProps) {
  return (
    <div className={className} title={title} data-testid={label}>
      {children && <div className="header">{children}</div>}
      {!children && <div className="header">{value === undefined || value === "" ? "-" : value}</div>}
      <div className="small text-muted border-top border-secondary">{label}</div>
    </div>
  );
}
