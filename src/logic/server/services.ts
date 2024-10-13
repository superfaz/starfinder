import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { convert, fail, PromisedResult, start, succeed } from "chain-of-actions";
import { redirect } from "next/navigation";
import { ZodError, ZodType, ZodTypeDef } from "zod";
import { DataSource, IDataSource } from "data";
import { ParsingError, UnauthorizedError } from "logic/errors";
import { ViewBuilder } from "view/server";

export function parse<T, D extends ZodTypeDef, I>(
  schema: ZodType<T, D, I>,
  data: unknown
): PromisedResult<T, ParsingError> {
  return convert({
    try: async () => schema.parse(data),
    catch: (error) => {
      if (error instanceof ZodError) {
        return new ParsingError(error.flatten().fieldErrors);
      } else {
        throw error;
      }
    },
  });
}

export function hasValidInput<T, D extends ZodTypeDef, I>(
  schema: ZodType<T, D, I>,
  data: unknown
): PromisedResult<{ data: T }, ParsingError> {
  return start()
    .onSuccess(() => parse(schema, data))
    .onSuccess(async (data) => succeed({ data }))
    .runAsync();
}

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

export function redirectToSignIn(returnTo: string): never {
  redirect(`/api/auth/login?post_login_redirect_url=${encodeURIComponent(returnTo)}`);
}

export function getViewBuilder(dataSource: IDataSource): PromisedResult<{ builder: ViewBuilder }> {
  return succeed({ builder: new ViewBuilder(dataSource) });
}
