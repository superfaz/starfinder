import { findOrError } from "app/helpers";
import {
  AbilityScoreId,
  BonusCategoryId,
  BonusCategoryIds,
  ModifierTypes,
  Profession,
  SkillDefinition,
  SkillModifier,
  ofType,
} from "model";
import { IClientDataSet } from "data";
import { computeAbilityScoreModifier } from "./CharacterPresenter";
import { ICharacterPresenter } from "./ICharacterPresenter";

export interface BonusModifier {
  source: string;
  category: BonusCategoryId;
  value: number;
  applied: boolean;
}

export interface SkillPresenter {
  id: string;
  fullName: string;
  abilityScore: AbilityScoreId;
  definition: SkillDefinition;
  ranks: number;
  rankForced: boolean;
  isClassSkill: boolean;
  bonus: number | undefined;
  modifiers: BonusModifier[];
}

export class SkillPresenterBuilder {
  constructor(
    private parent: ICharacterPresenter,
    private data: IClientDataSet
  ) {}

  public buildProfessions(skills: Profession[]): SkillPresenter[] {
    const profession = findOrError(this.data.skills, "prof");
    return this.prepareSkillPresenters(
      skills.map((p) => ({
        id: p.id,
        fullName: p.name,
        definition: profession,
        abilityScore: p.abilityScore,
        ranks: 0,
        isClassSkill: this.parent.getClassSkills().includes(profession.id),
        rankForced: false,
        bonus: undefined,
        modifiers: [],
      }))
    );
  }

  public buildSkills(skills: SkillDefinition[]): SkillPresenter[] {
    return this.prepareSkillPresenters(
      skills.map((s) => ({
        id: s.id,
        fullName: s.name,
        definition: s,
        abilityScore: s.abilityScore as AbilityScoreId,
        ranks: 0,
        isClassSkill: this.parent.getClassSkills().includes(s.id),
        rankForced: false,
        bonus: undefined,
        modifiers: [],
      }))
    );
  }

  private addAbilityBonus(presenter: SkillPresenter) {
    const abilityScore = findOrError(this.data.abilityScores, presenter.abilityScore);
    const abilityScoreModifier = computeAbilityScoreModifier(this.parent.getAbilityScores()[presenter.abilityScore]);
    presenter.modifiers.push({
      source: abilityScore.name,
      category: BonusCategoryIds.ability,
      value: abilityScoreModifier,
      applied: false,
    });
  }

  private addRankBonus(presenter: SkillPresenter) {
    if (presenter.ranks > 0) {
      presenter.modifiers.push({
        source: "Rangs",
        category: BonusCategoryIds.untyped,
        value: presenter.ranks,
        applied: false,
      });

      if (presenter.isClassSkill) {
        presenter.modifiers.push({
          source: "Compétence de classe",
          category: BonusCategoryIds.untyped,
          value: 3,
          applied: false,
        });
      }
    }
  }

  private addSkillModifierBonus(presenter: SkillPresenter) {
    const skillModifiers = this.parent
      .getModifiersWithSource()
      .filter(ofType(ModifierTypes.skill))
      .filter((m) => (m as SkillModifier).target === presenter.id || (m as SkillModifier).target === "all");
    for (const modifier of skillModifiers) {
      presenter.modifiers.push({
        source: modifier.source.name,
        category: (modifier as SkillModifier).category,
        value: (modifier as SkillModifier).value,
        applied: false,
      });
    }
  }

  private addMultipleClassSkillBonus(presenter: SkillPresenter) {
    const classSkillModifiers = this.parent
      .getModifiers()
      .filter(ofType(ModifierTypes.classSkill))
      .filter((m) => m.target === presenter.id || m.target === "all");
    if (classSkillModifiers.length > 1) {
      const bonus = classSkillModifiers.filter((m) => m.doubleEffect === "bonus").length;
      if (bonus > 0) {
        presenter.modifiers.push({
          source: "double effect",
          category: BonusCategoryIds.untyped,
          value: bonus,
          applied: false,
        });
      }
    }
  }

  private addAppliedStatus(presenter: SkillPresenter) {
    for (const category of this.data.bonusCategories) {
      const categoryResults = presenter.modifiers.filter((r) => r.category === category.id);
      if (category.stack) {
        for (const result of categoryResults) {
          result.applied = true;
        }
      } else {
        const bestValue = Math.max(...categoryResults.map((r) => r.value));
        const result = presenter.modifiers.find((r) => r.category === category.id && r.value === bestValue);
        if (result) {
          result.applied = true;
        }
      }
    }
  }

  public retrieveSkillBonuses(presenter: SkillPresenter) {
    this.addAbilityBonus(presenter);
    this.addRankBonus(presenter);
    this.addSkillModifierBonus(presenter);
    this.addMultipleClassSkillBonus(presenter);
    if (!presenter.definition.trainedOnly || presenter.ranks > 0) {
      this.addAppliedStatus(presenter);
    }
  }

  private prepareSkillPresenters(skills: SkillPresenter[]): SkillPresenter[] {
    const rankModifiers = this.parent.getModifiers().filter(ofType(ModifierTypes.rankSkill));

    return skills.map((s) => {
      const rankForced: boolean = rankModifiers.some((m) => m.target === s.id);
      const ranks: number = this.parent.getSkillRanks(s.id) + (rankForced ? this.parent.getLevel() : 0);
      const abilityCode = findOrError(this.data.abilityScores, s.abilityScore).code;

      s.fullName = `${s.fullName} (${abilityCode})`;
      s.ranks = ranks;
      s.rankForced = rankForced;

      this.retrieveSkillBonuses(s);
      if (!s.definition.trainedOnly || s.ranks > 0) {
        s.bonus = s.modifiers.reduce((acc, m) => (m.applied ? acc + m.value : acc), 0);
      }

      return s;
    });
  }
}
