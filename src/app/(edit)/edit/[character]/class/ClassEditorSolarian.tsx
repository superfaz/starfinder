import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Form from "react-bootstrap/Form";
import type { ClassSolarian } from "model";
import {
  updateSolarianColor,
  UpdateSolarianColorInput,
  updateSolarianDamageType,
  UpdateSolarianDamageTypeInput,
  updateSolarianManifestation,
  UpdateSolarianManifestationInput,
  UpdateState,
} from "./actions";
import { useStaticData } from "logic/StaticContext";
import { useCharacterId } from "../helpers-client";
import { ActionErrors } from "app/helpers-server";

export default function SolarianEditor({
  state,
  setState,
}: Readonly<{ state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>) {
  const characterId = useCharacterId();
  const damageTypes = useStaticData().damageTypes.filter((d) => d.category === "kinetic");
  const classDetails = state.details as ClassSolarian | undefined;
  const [colorErrors, setColorErrors] = useState<ActionErrors<UpdateSolarianColorInput>>({});
  const [damageTypeErrors, setDamageTypeErrors] = useState<ActionErrors<UpdateSolarianDamageTypeInput>>({});
  const [manifestationErrors, setManifestationErrors] = useState<ActionErrors<UpdateSolarianManifestationInput>>({});

  if (!classDetails) {
    return null;
  }

  const selectedManifestation = classDetails.manifestations.find((s) => s.id === state.solarianManifestation);

  async function handleColorChange(event: ChangeEvent<HTMLSelectElement>) {
    const result = await updateSolarianColor({ characterId, colorId: event.target.value });
    if (result.success) {
      setState(result);
    } else {
      setColorErrors(result.errors);
    }
  }

  async function handleDamageTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    const result = await updateSolarianDamageType({ characterId, damageTypeId: event.target.value });
    if (result.success) {
      setState(result);
    } else {
      setDamageTypeErrors(result.errors);
    }
  }

  async function handleManifestationChange(event: ChangeEvent<HTMLSelectElement>) {
    const result = await updateSolarianManifestation({ characterId, manifestationId: event.target.value });
    if (result.success) {
      setState(result);
    } else {
      setManifestationErrors(result.errors);
    }
  }

  return (
    <>
      <Form.FloatingLabel controlId="solarianColor" label="Couleur de la manifestation solaire">
        <Form.Select value={state.solarianColor ?? ""} onChange={handleColorChange} isInvalid={!!colorErrors.colorId}>
          {classDetails.colors.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>

      <Form.FloatingLabel controlId="solarianManifestation" label="Forme de la manifestation solaire">
        <Form.Select
          value={state.solarianManifestation ?? ""}
          onChange={handleManifestationChange}
          isInvalid={!!manifestationErrors.manifestationId}
        >
          {classDetails.manifestations.map((manifestation) => (
            <option key={manifestation.id} value={manifestation.id}>
              {manifestation.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedManifestation && <p className="text-muted">{selectedManifestation.description}</p>}

      {selectedManifestation?.id === "weapon" && (
        <Form.FloatingLabel controlId="solarianDamageType" label="Type de dégâts">
          <Form.Select
            value={state.solarianDamageType ?? ""}
            onChange={handleDamageTypeChange}
            isInvalid={!!damageTypeErrors.damageTypeId}
          >
            {damageTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Form.Select>
        </Form.FloatingLabel>
      )}
    </>
  );
}
