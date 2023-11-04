import Link from "next/link";

export default async function Page() {
  return (
    <>
      <h1>Bienvenue !</h1>
      <Link href="/characters/create" className="btn btn-primary">Créer un personnage</Link>
    </>
  );
}
