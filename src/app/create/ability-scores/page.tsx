import { Metadata } from "next";
import { secure } from "../helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Définition des caractéristiques et compétences",
};

export default secure(<PageContent />, "/create/ability-scores");
