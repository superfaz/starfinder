import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PromisedResult, Result } from "chain-of-actions";
import { redirect } from "next/navigation";

export type ActionErrors<Input> = { [P in keyof Input]?: string[] };
type ActionFailure<Input> = { success: false; errors: ActionErrors<Input> };
type ActionSuccess<Output> = { success: true } & Output;
export type ActionResult<Input, Output> = ActionSuccess<Output> | ActionFailure<Input>;

export async function isSecure(returnTo: string): Promise<boolean> {
  const { isAuthenticated } = process.env.AUTH_DEBUG ? { isAuthenticated: async () => true } : getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(`/api/auth/login?post_login_redirect_url=${encodeURIComponent(returnTo)}`);
    return false;
  } else {
    return true;
  }
}

export async function log<Data, Error, Context>(
  previous: Result<Data, Error>,
  context: Context
): PromisedResult<Data, Error> {
  console.log("Previous", previous);
  console.log("Context", context);
  return previous;
}
