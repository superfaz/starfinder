import { addData, onError, onSuccess, start, SuccessResult } from "chain-of-actions";
import { ZodType, ZodTypeDef } from "zod";
import { IDataSource } from "data";
import { badRequest } from "navigation";
import { ViewBuilder } from "view/server";
import { getAuthenticatedUser, getDataSource, getViewBuilder, hasValidInput, redirectToSignIn } from "./extras";

interface IContext {
  user: { id: string };
  dataSource: IDataSource;
  viewBuilder: ViewBuilder;
}

interface IPageContext<Input> extends IContext {
  input: Input;
}

export function prepareContext(redirect: string): Promise<SuccessResult<IContext>> {
  return start()
    .add(onSuccess(getAuthenticatedUser))
    .add(onError(() => redirectToSignIn(redirect)))
    .add(addData(getDataSource))
    .add(addData(getViewBuilder))
    .runAsync();
}

export function preparePageContext<T, D extends ZodTypeDef, I>(
  redirect: string,
  schema: ZodType<T, D, I>,
  input: T
): Promise<SuccessResult<IPageContext<T>>> {
  return start()
    .add(onSuccess(() => hasValidInput(schema, input)))
    .add(onError(badRequest))
    .add(addData(getAuthenticatedUser))
    .add(onError(() => redirectToSignIn(redirect)))
    .add(addData(getDataSource))
    .add(addData(getViewBuilder))
    .runAsync();
}
