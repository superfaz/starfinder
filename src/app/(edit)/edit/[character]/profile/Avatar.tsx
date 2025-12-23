"use client";

import { ChangeEvent } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { useCharacterPresenter } from "../helpers-client";

export function Avatar() {
  const presenter = useCharacterPresenter();
  const avatars = useAppSelector((state) => state.data.avatars);
  const dispatch = useAppDispatch();

  if (presenter.getClass() === null) {
    return null;
  }

  const selectedRace = presenter.getRace();
  if (!selectedRace) {
    return null;
  }

  const filteredAvatars = avatars.filter((avatar) => avatar.tags.includes(selectedRace.id));
  const avatar = presenter.getAvatar();
  const index = avatar === null ? 0 : filteredAvatars.findIndex((c) => c.id === avatar.id);

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>): void {
    const index = parseInt(e.target.value);
    const avatar = filteredAvatars[index];
    dispatch(mutators.updateAvatar(avatar.id));
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Avatar</h2>
      <Card>
        <picture>
          <img alt="avatar" src={"/" + filteredAvatars[index].image} className="img-fluid" />
        </picture>
        <Card.Body>
          <Form.Range
            aria-label="Avatar"
            min={0}
            max={filteredAvatars.length - 1}
            step={1}
            value={index}
            onChange={handleAvatarChange}
          />
        </Card.Body>
      </Card>
    </Stack>
  );
}
