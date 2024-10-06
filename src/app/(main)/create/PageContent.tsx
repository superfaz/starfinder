"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { FormSelectClass } from "app/components/FormSelectClass";
import { FormSelectRace } from "app/components/FormSelectRace";
import { FormSelectTheme } from "app/components/FormSelectTheme";
import type { IEntry } from "model";
import { CreateDataErrors, type RaceEntry } from "view";
import { create, type CreateData } from "./actions";

export function PageContent({
  races,
  themes,
  classes,
}: Readonly<{
  races: RaceEntry[];
  themes: IEntry[];
  classes: IEntry[];
}>) {
  const [state, setState] = useState<CreateData>({ name: "" });
  const [errors, setErrors] = useState<CreateDataErrors>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const id = event.target.id;
    setErrors({ ...errors, [id]: undefined });
    setState({ ...state, [id]: event.target.value });
  }

  async function handleSave() {
    // Save character data
    setLoading(true);
    try {
      const response = await create(state);

      if (response.success) {
        // Redirect to the detailed character creation page
        setErrors({});
        router.push("/edit/" + response.id);
      } else {
        // Provide error feedback to the user
        setErrors(response.errors);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <h1 className="mb-3">Concept de personnage</h1>
      <Row>
        <Col md={6}>
          <Stack direction="vertical" gap={2}>
            <div className="lead mt-3">Quel genre de héros de science-fantasy voulez-vous jouer ?</div>
            <Form.FloatingLabel controlId="description" label="Concept">
              <Form.Control
                as="textarea"
                value={state.description ?? ""}
                onChange={handleChange}
                aria-label="Concept"
                style={{ height: "20em" }}
              />
            </Form.FloatingLabel>

            <div className="lead mt-3">Quel est le nom de votre nouvel héros ?</div>
            <Form.FloatingLabel controlId="name" label="Nom du personnage">
              <Form.Control
                type="text"
                value={state.name ?? ""}
                onChange={handleChange}
                autoComplete="off"
                isInvalid={!!errors.name}
                aria-invalid={!!errors.name}
              />
              <div className="invalid-feedback">Le nom est obligatoire</div>
            </Form.FloatingLabel>
          </Stack>
        </Col>
        <Col md={6} className="mt-2 mb-5">
          <Stack direction="vertical" gap={2}>
            <div className="lead mt-3">Quelle sera sa race ?</div>
            <FormSelectRace races={races} value={state.race ?? ""} onChange={handleChange} isInvalid={!!errors.race} />

            <div className="lead mt-3">Quel sera son thème ?</div>
            <FormSelectTheme
              themes={themes}
              value={state.theme ?? ""}
              onChange={handleChange}
              isInvalid={!!errors.theme}
            />

            <div className="lead mt-3">Quelle sera sa classe ?</div>
            <FormSelectClass
              classes={classes}
              value={state.class ?? ""}
              onChange={handleChange}
              isInvalid={!!errors.class}
            />
          </Stack>
        </Col>
        <Col md={6} lg={4} className="d-none offset-md-3 offset-lg-8 mt-2">
          <Stack direction="vertical" gap={2}>
            <Button variant="primary" className="my-5" disabled={loading} onClick={handleSave}>
              Démarrer la création détaillée
            </Button>
          </Stack>
        </Col>
      </Row>
      <Container fluid className="fixed-bottom py-2 bg-darkblue">
        <Row>
          <Col>
            <Button variant="primary" className="w-100" disabled={loading} onClick={handleSave}>
              Démarrer la création
            </Button>
          </Col>
          <Col>
            <Link className="btn btn-outline-secondary w-100" href="/">
              <i className="bi bi-x-lg"></i> Annuler
            </Link>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
