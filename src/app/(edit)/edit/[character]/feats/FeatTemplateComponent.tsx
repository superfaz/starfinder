import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { CharacterPresenter, FeatTemplateExtended, mutators, useAppDispatch } from "logic";
import { FeatComponentBody } from "./FeatComponentBody";

export function FeatTemplateComponent({
  presenter,
  template,
}: Readonly<{
  presenter: CharacterPresenter;
  template: FeatTemplateExtended;
}>) {
  const dispatch = useAppDispatch();
  const templater = presenter.createTemplater();
  const featsCount = presenter.getSelectableFeatCount();

  const availableOptions = template.options?.filter((o) => o.available);
  const unavailableOptions = template.options?.filter((o) => !o.available);
  const [selectedOptionId, setSelectedOptionId] = useState(availableOptions[0]?.id || unavailableOptions[0]?.id);
  const selectedOption = template.options?.find((o) => o.id === selectedOptionId);
  const feat = templater.convertFeat(template, selectedOption);

  function handleAddFeat(target?: string) {
    dispatch(mutators.addFeat({ id: template.id, target }));
  }

  return (
    <Card data-testid={feat.id}>
      <Card.Header role="heading">
        <Row className="align-items-center">
          <Col className={!template.available ? "text-danger" : undefined}>
            {feat.name}
            {feat.combatFeat ? " (combat)" : ""}
          </Col>
          {template.type === "simple" && (
            <Col xs="auto">
              <Button
                variant={!template.available ? "outline-danger" : undefined}
                disabled={!template.available || featsCount <= 0}
                size="sm"
                onClick={() => handleAddFeat()}
              >
                Ajouter
              </Button>
            </Col>
          )}
        </Row>
      </Card.Header>
      {(template.type === "targeted" || template.type === "multiple") && (
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <Form.Select value={selectedOptionId} onChange={(e) => setSelectedOptionId(e.target.value)}>
                {availableOptions && (
                  <optgroup label="Disponibles">
                    {availableOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {unavailableOptions && (
                  <optgroup label="Non disponible" className="text-danger">
                    {unavailableOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </Form.Select>
            </Col>
            <Col xs="auto">
              <Button
                variant={!selectedOption?.available ? "outline-danger" : undefined}
                disabled={!selectedOption?.available || featsCount <= 0}
                size="sm"
                onClick={() => handleAddFeat(selectedOptionId)}
              >
                Ajouter
              </Button>
            </Col>
          </Row>
        </Card.Body>
      )}
      <FeatComponentBody character={presenter} feat={feat} />
    </Card>
  );
}
