import auth0 from "app/auth0";
import { redirect } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { CharacterPresenter, useAppSelector } from "logic";

export function useCharacterPresenter() {
  const data = useAppSelector((state) => state.data);
  const character = useAppSelector((state) => state.character);
  const classesDetails = useAppSelector((state) => state.classesDetails);
  return useMemo(() => new CharacterPresenter(data, classesDetails, character), [data, classesDetails, character]);
}

export function secure(content: ReactNode, returnTo: string): () => Promise<ReactNode> {
  return async function (): Promise<ReactNode> {
    const session = await auth0.getSession();

    if (!session) {
      redirect(`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
    }

    return content;
  };
}
