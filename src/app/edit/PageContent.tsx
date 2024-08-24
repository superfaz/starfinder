import { Character } from "model";

export function PageContent({ characters }: { characters: Character[] }) {
  return (
    <div>
      <h1>Personnages</h1>
      <ul>
        {characters.map((character) => (
          <li key={character.id}>{character.name}<pre>{JSON.stringify(character, null, 2)}</pre></li>
        ))}
      </ul>
    </div>
  );
}
