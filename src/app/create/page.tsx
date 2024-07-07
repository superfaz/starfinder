import { Metadata } from "next";
import { secure } from "./helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Création",
};

export default secure(<PageContent />, "/create");
