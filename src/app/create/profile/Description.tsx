"use client";

import { mutators, useAppDispatch } from "logic";
import { useCharacterPresenter } from "../helpers";
import { Form, Stack } from "react-bootstrap";
import { ChangeEvent } from "react";

export function Description() {
  const presenter = useCharacterPresenter();
  const dispatch = useAppDispatch();

  function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    dispatch(mutators.updateDescription(e.target.value));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Biographie & description</h2>
      <Form.Control
        as="textarea"
        aria-label="Biographie & description"
        value={presenter.getDescription()}
        onChange={handleDescriptionChange}
        style={{ height: "20em" }}
      />
    </Stack>
  );
}
