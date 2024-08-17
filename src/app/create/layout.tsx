import { ReactNode } from "react";
import { LayoutServer } from "../edit/[character]/layout";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return await LayoutServer({ children });
}
