import { redirect } from "next/navigation";

export default async function Page({ params }: Readonly<{ params: { characterId: string } }>) {
  redirect("/create/" + params.characterId + "/origin");
}
