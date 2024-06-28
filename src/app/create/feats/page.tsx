import { Metadata } from "next";
import { secure } from "../helpers";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection des dons",
};

export default secure(<PageContent />, "/create/feats");
