"use client";

import * as Sentry from "@sentry/nextjs";
import { UnauthorizedError } from "logic";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: Readonly<{ error: Error }>) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  if (Error instanceof UnauthorizedError) {
    return (
      <html lang="fr">
        <body>
          <Error statusCode={401} />
        </body>
      </html>
    );
  }

  return (
    <html lang="fr">
      <body>
        <Error statusCode={500} />
      </body>
    </html>
  );
}
