import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { convert, fail, PromisedResult, start, succeed } from "chain-of-actions";
import { DataSource, IDataSource } from "data";
import { UnauthorizedError } from "logic/errors";

export function getAuthenticatedUser(): PromisedResult<
  { user: KindeUser<Record<string, unknown>> },
  UnauthorizedError
> {
  return start()
    .onSuccess(() =>
      convert({
        try: () => getKindeServerSession().getUser(),
        catch: () => new UnauthorizedError(),
      })
    )
    .onSuccess((user) => (user ? succeed({ user }) : fail(new UnauthorizedError())))
    .runAsync();
}

export function getDataSource(): PromisedResult<{ dataSource: IDataSource }, never> {
  return succeed({ dataSource: new DataSource() });
}
