import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export function secure(content: ReactNode, returnTo: string): () => Promise<ReactNode> {
  return async function (): Promise<ReactNode> {
    const { isAuthenticated } = getKindeServerSession();

    if (!(await isAuthenticated())) {
      redirect(`/api/auth/login?post_login_redirect_url=${encodeURIComponent(returnTo)}`);
    } else {
      return content;
    }
  };
}
