import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Book, BookSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Book> = {
  mode: "static",
  type: "simple",
  name: "books",
  schema: BookSchema,
};

export const books = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "books") as PromisedResult<{ books: Book[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "book") as PromisedResult<
      { book: Book },
      DataSourceError | NotFoundError
    >,
};
