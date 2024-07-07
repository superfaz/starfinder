import auth0 from "app/auth0";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export function secure(content: ReactNode, returnTo: string): () => Promise<ReactNode> {
  return async function (): Promise<ReactNode> {
    const session = await auth0.getSession();

    if (!session) {
      redirect(`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
    } else {
      return content;
    }
  };
}
