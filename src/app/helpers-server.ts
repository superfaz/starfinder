import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export async function isSecure(returnTo: string): Promise<boolean> {
  const { isAuthenticated } = process.env.AUTH_DEBUG ? { isAuthenticated: async () => true } : getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(`/api/auth/login?post_login_redirect_url=${encodeURIComponent(returnTo)}`);
    return false;
  } else {
    return true;
  }
}
