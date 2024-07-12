"use client";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { useCharacterPresenter } from "../helpers-client";
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
import CardEquipment from "./CardEquipment";

export function PageClient() {
  const presenter = useCharacterPresenter();

  return (
    <Row>
      <Col lg={3} className="mb-2">
        <Stack direction="vertical" gap={2}>
          <CardAvatar presenter={presenter} />
          <CardFeats presenter={presenter} />
        </Stack>
      </Col>
      <Col lg={3} className="mb-2">
        <Stack direction="vertical" gap={2}>
          <CardProfile presenter={presenter} />
          <CardDescription presenter={presenter} />
        </Stack>
      </Col>
      <Col lg={3} className="mb-2">
        <Stack direction="vertical" gap={2}>
          <CardAbilities presenter={presenter} />
          <CardSpells presenter={presenter} />
        </Stack>
      </Col>
      <Col lg={3} className="mb-2">
        <Stack direction="vertical" gap={2}>
          <CardAbilityScores presenter={presenter} />
          <CardSkills presenter={presenter} />
        </Stack>
      </Col>
      <Col lg={3} className="mb-2">
        <Stack direction="vertical" gap={2}>
          <CardInitiative presenter={presenter} />
          <CardKeyPoints presenter={presenter} />
          <CardSavingThrows presenter={presenter} />
          <CardArmorClass presenter={presenter} />
          <CardAttackBonuses presenter={presenter} />
          <CardWeapons presenter={presenter} />
        </Stack>
      </Col>
      <Col lg={3} className="mb-2">
        <Stack direction="vertical" gap={2}>
          <CardEquipment presenter={presenter} />
        </Stack>
      </Col>
    </Row>
  );
}
