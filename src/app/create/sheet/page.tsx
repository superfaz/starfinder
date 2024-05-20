"use client";

import Col from "react-bootstrap/Col";
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
import { Splide, SplideSlide } from "@splidejs/react-splide";
import CardEquipment from "./CardEquipment";

export default function Page() {
  const presenter = useCharacterPresenter();

  return (
    <Col lg={12}>
      <Splide
        options={{ rewind: true, perPage: 4, perMove: 1, gap: "1em", arrows: false, omitEnd: true }}
        tag="section"
        aria-label="Character sheet navigation"
      >
        <SplideSlide>
          <Stack direction="vertical" gap={2}>
            <CardAvatar character={presenter} />
            <CardFeats character={presenter} />
          </Stack>
        </SplideSlide>
        <SplideSlide>
          <Stack direction="vertical" gap={2}>
            <CardProfile character={presenter} />
            <CardDescription character={presenter} />
          </Stack>
        </SplideSlide>
        <SplideSlide>
          <Stack direction="vertical" gap={2}>
            <CardAbilities character={presenter} />
            <CardSpells character={presenter} />
          </Stack>
        </SplideSlide>
        <SplideSlide>
          <Stack direction="vertical" gap={2}>
            <CardAbilityScores character={presenter} />
            <CardSkills character={presenter} />
          </Stack>
        </SplideSlide>
        <SplideSlide>
          <Stack direction="vertical" gap={2}>
            <CardInitiative character={presenter} />
            <CardKeyPoints character={presenter} />
            <CardSavingThrows character={presenter} />
            <CardArmorClass character={presenter} />
            <CardAttackBonuses character={presenter} />
            <CardWeapons character={presenter} />
          </Stack>
        </SplideSlide>
        <SplideSlide>
          <Stack direction="vertical" gap={2}>
            <CardEquipment character={presenter} />
          </Stack>
        </SplideSlide>
      </Splide>
    </Col>
  );
}
