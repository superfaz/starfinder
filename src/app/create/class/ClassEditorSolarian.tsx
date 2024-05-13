import { ChangeEvent, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { mutators, retrieveClassDetails, useAppDispatch, useAppSelector, useClassDetails } from "logic";
import type { ClassSolarian } from "model";
import { CharacterProps } from "../Props";

export default function SolarianEditor({ character }: CharacterProps) {
  const damageTypes = useAppSelector((state) => state.data.damageTypes).filter((d) => d.category === "kinetic");
  const classDetails = useClassDetails<ClassSolarian>("solarian");
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails("solarian"));
    }
  }, [dispatch, classDetails]);

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const selectedManifestation = classDetails.manifestations.find((s) => s.id === character.getSolarianManifestation());

  const handleColorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(mutators.updateSolarianColor(event.target.value));
  };

  const handleManifestationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(mutators.updateSolarianManifestation(event.target.value));
  };

  const handleDamageTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(mutators.updateSolarianDamageType(event.target.value));
  };

  return (
    <>
      <Form.FloatingLabel controlId="solarianColor" label="Couleur de la manifestation solaire">
        <Form.Select value={character.getSolarianColor() ?? ""} onChange={handleColorChange}>
          {classDetails.colors.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>

      <Form.FloatingLabel controlId="solarianManifestation" label="Forme de la manifestation solaire">
        <Form.Select value={character.getSolarianManifestation() ?? ""} onChange={handleManifestationChange}>
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
          <Form.Select value={character.getSolarianDamageType() ?? ""} onChange={handleDamageTypeChange}>
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
