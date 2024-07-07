"use client";

import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { mutators, useAppDispatch } from "logic";
import { useCharacterPresenter } from "../helpers-client";

export function Description() {
  const presenter = useCharacterPresenter();
  const dispatch = useAppDispatch();

  if (presenter.getClass() === null) {
    return null;
  }

  function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    dispatch(mutators.updateDescription(e.target.value));
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
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
