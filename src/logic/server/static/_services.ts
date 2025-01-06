import { fail, onSuccess, start, succeed } from "chain-of-actions";
import { IDataSource, IStaticDescriptor } from "data";
import { NotFoundError } from "logic/errors";
import { IModel } from "model";

export type IRetrieveAllParams = { dataSource: IDataSource };

export function retrieveAll<T extends IModel>(
  params: IRetrieveAllParams,
  descriptor: IStaticDescriptor<T>,
  code: string
) {
  return start()
    .withContext(params)
    .add(onSuccess((_, { dataSource }) => dataSource.get(descriptor).getAll()))
    .add(onSuccess((values) => succeed({ [code]: values })))
    .runAsync();
}

type IRetrieveOneParams = { dataSource: IDataSource; id: string };

export function retrieveOne<T extends IModel>(
  params: IRetrieveOneParams,
  descriptor: IStaticDescriptor<T>,
  code: string
) {
  return start()
    .withContext(params)
    .add(onSuccess((_, { dataSource, id }) => dataSource.get(descriptor).findOne(id)))
    .add(
      onSuccess((value) => (value === undefined ? fail(new NotFoundError(descriptor.name, params.id)) : succeed(value)))
    )
    .add(onSuccess((value) => succeed({ [code]: value })))
    .runAsync();
}
