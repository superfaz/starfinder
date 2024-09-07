import { DefaultNavBar } from "app/DefaultNavBar";

export function LayoutAuthenticated({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <DefaultNavBar />
      {children}
    </>
  );
}
