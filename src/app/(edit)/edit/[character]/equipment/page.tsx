import { Metadata } from "next";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { prepareContext } from "../helpers-server";
import { EquipmentSelection } from "./EquipmentSelection";

export const metadata: Metadata = {
  title: "Sélection de l'équipement",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await prepareContext(`/edit/${params.character}/equipment`, IdSchema, params.character);

  if (!context.success) {
    return serverError(context.error);
  }

  return <EquipmentSelection />;
}
