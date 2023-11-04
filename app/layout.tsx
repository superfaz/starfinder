import "bootstrap/dist/css/bootstrap.min.css";
import "./site.css";
import React from "react";
import { Container } from "react-bootstrap";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        <Container>{children}</Container>
      </body>
    </html>
  );
}
