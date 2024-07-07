"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
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
    <Splide
      options={{ rewind: true, perPage: 4, perMove: 1, gap: "1em", arrows: false, omitEnd: true }}
      tag="section"
      aria-label="Character sheet navigation"
    >
      <SplideSlide>
        <Stack direction="vertical" gap={2}>
          <CardAvatar presenter={presenter} />
          <CardFeats presenter={presenter} />
        </Stack>
      </SplideSlide>
      <SplideSlide>
        <Stack direction="vertical" gap={2}>
          <CardProfile presenter={presenter} />
          <CardDescription presenter={presenter} />
        </Stack>
      </SplideSlide>
      <SplideSlide>
        <Stack direction="vertical" gap={2}>
          <CardAbilities presenter={presenter} />
          <CardSpells presenter={presenter} />
        </Stack>
      </SplideSlide>
      <SplideSlide>
        <Stack direction="vertical" gap={2}>
          <CardAbilityScores presenter={presenter} />
          <CardSkills presenter={presenter} />
        </Stack>
      </SplideSlide>
      <SplideSlide>
        <Stack direction="vertical" gap={2}>
          <CardInitiative presenter={presenter} />
          <CardKeyPoints presenter={presenter} />
          <CardSavingThrows presenter={presenter} />
          <CardArmorClass presenter={presenter} />
          <CardAttackBonuses presenter={presenter} />
          <CardWeapons presenter={presenter} />
        </Stack>
      </SplideSlide>
      <SplideSlide>
        <Stack direction="vertical" gap={2}>
          <CardEquipment presenter={presenter} />
        </Stack>
      </SplideSlide>
    </Splide>
  );
}
