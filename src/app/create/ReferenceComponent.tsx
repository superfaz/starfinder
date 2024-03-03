import { Reference } from "model";

export function ReferenceComponent({ reference }: { reference: Reference }) {
  return (
    <div className="reference small rounded-pill border border-success bg-success px-2 ms-auto">
      <i className="bi bi-book" aria-label="Référence"></i>
      <div className="text">
        <em>
          {reference.book} - page {reference.page}
        </em>
      </div>
    </div>
  );
}
