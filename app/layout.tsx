import React from "react";
import { Container } from "react-bootstrap";
import "./site.scss";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa&family=Orbitron&display=optional"
          rel="stylesheet"
        />
      </head>
      <body>
        <Container fluid>{children}</Container>
      </body>
    </html>
  );
}
