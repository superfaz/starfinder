import { useAppSelector } from "logic";
import type { Reference } from "model";

export function ReferenceComponent({ reference }: Readonly<{ reference: Reference }>) {
  const books = useAppSelector((state) => state.data.books);
  const book = books.find((book) => book.id === reference.book);

  if (!book) {
    console.error(`Book ${reference.book} not found`);
    return null;
  }

  const chapter = book.chapters.find((chapter) => chapter.start <= reference.page && chapter.end >= reference.page);
  if (!chapter) {
    console.error(`Chapter for page ${reference.page}, on book ${reference.book} not found`);
    return null;
  }

  return (
    <div className="reference small rounded-pill border border-success bg-success px-2 ms-auto">
      <i className="bi bi-book" aria-label="Référence"></i>
      <div className="text">
        <em>
          {book.name} - chapitre {chapter.number} - page {reference.page}
        </em>
      </div>
    </div>
  );
}
