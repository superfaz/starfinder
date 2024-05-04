"use client";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { useCharacterPresenter } from "../helpers";
import { CardProfile } from "./CardProfile";
import { CardAvatar } from "./CardAvatar";
import { CardDescription } from "./CardDescription";
import { CardAbilityScores } from "./CardAbilityScores";
import { CardInitiative } from "./CardInitiative";
import { CardSkills } from "./CardSkills";
import { CardKeyPoints } from "./CardKeyPoints";
import { CardSavingThrows } from "./CardSavingThrows";
import { CardArmorClass } from "./CardArmorClass";
import { CardAttackBonuses } from "./CardAttachBonuses";
import { CardWeapons } from "./CardWeapons";
import { CardAbilities } from "./CardAbilities";
import { CardFeats } from "./CardFeats";
import { CardSpells } from "./CardSpells";

export function Sheet() {
  const presenter = useCharacterPresenter();

  return (
    <Row style={{ width: 390 * 5 }}>
      <Col>
        <Stack direction="vertical" gap={2}>
          <CardAvatar character={presenter} />
          <CardFeats character={presenter} />
        </Stack>
      </Col>
      <Col>
        <Stack direction="vertical" gap={2}>
          <CardProfile character={presenter} />
          <CardDescription character={presenter} />
        </Stack>
      </Col>
      <Col>
        <Stack direction="vertical" gap={2}>
          <CardAbilities character={presenter} />
          <CardSpells character={presenter} />
        </Stack>
      </Col>
      <Col>
        <Stack direction="vertical" gap={2}>
          <CardAbilityScores character={presenter} />
          <CardSkills character={presenter} />
        </Stack>
      </Col>
      <Col>
        <Stack direction="vertical" gap={2}>
          <CardInitiative character={presenter} />
          <CardKeyPoints character={presenter} />
          <CardSavingThrows character={presenter} />
          <CardArmorClass character={presenter} />
          <CardAttackBonuses character={presenter} />
          <CardWeapons character={presenter} />
        </Stack>
      </Col>
    </Row>
  );
}
