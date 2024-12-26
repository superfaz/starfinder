import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { convert, fail, onSuccess, PromisedResult, start, succeed } from "chain-of-actions";
import { redirect } from "next/navigation";
import { ZodError, ZodType, ZodTypeDef } from "zod";
import { DataSource, IDataSource } from "data";
import { createParsingError, ParsingError, UnauthorizedError } from "logic/errors";
import { ViewBuilder } from "view/server";

export function parse<T, D extends ZodTypeDef, I>(
  schema: ZodType<T, D, I>,
  data: unknown
): PromisedResult<T, ParsingError> {
  return convert({
    try: async () => schema.parse(data),
    catch: (error) => {
      if (error instanceof ZodError) {
        return createParsingError(error.flatten().fieldErrors);
      } else {
        throw error;
      }
    },
  });
}

export function hasValidInput<T, D extends ZodTypeDef, I>(
  schema: ZodType<T, D, I>,
  data: unknown
): PromisedResult<{ input: T }, ParsingError> {
  return start()
    .add(onSuccess(() => parse(schema, data)))
    .add(onSuccess((input) => succeed({ input })))
    .runAsync();
}

export function getAuthenticatedUser(): PromisedResult<
  { user: KindeUser<Record<string, unknown>> },
  UnauthorizedError
> {
  return start()
    .add(
      onSuccess(() =>
        convert({
          try: () => getKindeServerSession().getUser(),
          catch: () => new UnauthorizedError(),
        })
      )
    )
    .add(onSuccess((user) => (user ? succeed({ user }) : fail(new UnauthorizedError()))))
    .runAsync();
}

export function getDataSource(): PromisedResult<{ dataSource: IDataSource }> {
  return succeed({ dataSource: new DataSource() });
}

export function redirectToSignIn(returnTo: string): never {
  redirect(`/api/auth/login?post_login_redirect_url=${encodeURIComponent(returnTo)}`);
}

export function getViewBuilder({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ viewBuilder: ViewBuilder }> {
  return succeed({ viewBuilder: new ViewBuilder(dataSource) });
}
