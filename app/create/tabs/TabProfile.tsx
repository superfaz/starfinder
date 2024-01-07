import { ChangeEvent } from "react";
import { Button, Card, Form, InputGroup, Stack } from "react-bootstrap";
import { SimpleEditProps } from "../Props";
import { useAppSelector } from "../store";

export function Profile({ character, mutators }: SimpleEditProps) {
  const data = useAppSelector((state) => state.data);

  function handleNameChange(e: ChangeEvent<HTMLInputElement>): void {
    mutators.updateName(e.target.value);
  }

  function handleRandomNameClick(): void {
    const selectedRace = character.getRace();
    if (!selectedRace) {
      return;
    }

    const names = selectedRace.names;
    const name = names[Math.floor(Math.random() * names.length)];
    mutators.updateName(name);
  }

  function handleAlignmentChange(e: ChangeEvent<HTMLSelectElement>): void {
    mutators.updateAlignment(e.target.value);
  }

  function handleSexChange(e: ChangeEvent<HTMLInputElement>): void {
    mutators.updateSex(e.target.value);
  }

  function handleHomeWorldChange(e: ChangeEvent<HTMLInputElement>): void {
    mutators.updateHomeWorld(e.target.value);
  }

  function handleDeityChange(e: ChangeEvent<HTMLInputElement>): void {
    mutators.updateDeity(e.target.value);
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Profil</h2>
      <InputGroup>
        <Form.FloatingLabel controlId="character-name" label="Nom du personnage">
          <Form.Control type="text" autoComplete="off" value={character.getName()} onChange={handleNameChange} />
        </Form.FloatingLabel>
        <Button variant="outline-secondary" onClick={handleRandomNameClick}>
          <i className="bi bi-shuffle"></i>
        </Button>
      </InputGroup>

      <Form.FloatingLabel controlId="alignment" label="Alignement">
        <Form.Select value={character.getAlignment()} onChange={handleAlignmentChange}>
          {character.getAlignment() === "" && <option value=""></option>}
          {data.alignments.map((alignment) => (
            <option key={alignment.id} value={alignment.id}>
              {`${alignment.name} (${alignment.code})`}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>

      <Form.FloatingLabel controlId="sex" label="Sexe">
        <Form.Control type="text" value={character.getSex()} onChange={handleSexChange} />
      </Form.FloatingLabel>

      <Form.FloatingLabel controlId="homeWorld" label="Monde natal">
        <Form.Control type="text" value={character.getHomeWorld()} onChange={handleHomeWorldChange} />
      </Form.FloatingLabel>

      <Form.FloatingLabel controlId="deity" label="Divinité">
        <Form.Control type="text" value={character.getDeity()} onChange={handleDeityChange} />
      </Form.FloatingLabel>
    </Stack>
  );
}

export function Avatar({ character, mutators }: SimpleEditProps) {
  const data = useAppSelector((state) => state.data);
  if (data === null) {
    return <div>Loading...</div>;
  }

  const selectedRace = character.getRace();
  if (!selectedRace) {
    return null;
  }

  const avatars = data.avatars.filter((avatar) => avatar.tags.includes(selectedRace.id));
  const avatar = character.getAvatar();
  const index = avatar === null ? 0 : avatars.findIndex((c) => c.id === avatar.id);

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>): void {
    const index = parseInt(e.target.value);
    const avatar = avatars[index];
    mutators.updateAvatar(avatar.id);
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Avatar</h2>
      <Card>
        <picture>
          <img alt="avatar" src={"/" + avatars[index].image} className="img-fluid" />
        </picture>
        <Card.Body>
          <Form.Range min={0} max={avatars.length - 1} step={1} value={index} onChange={handleAvatarChange} />
        </Card.Body>
      </Card>
    </Stack>
  );
}
