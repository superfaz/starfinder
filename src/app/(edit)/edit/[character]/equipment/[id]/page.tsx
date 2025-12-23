import { z } from "zod";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { PageContent } from "./PageContent";
import { preparePageContext } from "../../helpers-server";

const InputSchema = z
  .object({
    character: IdSchema,
    id: IdSchema,
  })
  .strict();

export default async function Page({ params }: Readonly<{ params: { character: string; id: string } }>) {
  const context = await preparePageContext(`/edit/${params.character}/equipment/${params.id}`, InputSchema, params);
  if (!context.success) {
    return serverError(context.error);
  }

  return <PageContent id={params.id} />;
}
