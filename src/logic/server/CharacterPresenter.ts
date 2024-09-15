import * as Sentry from "@sentry/nextjs";
import { findOrError } from "app/helpers";
import { DataSets, IDataSource } from "data";
import { Templater } from "logic/Templater";
import type {
  ArmorEquipmentDescriptor,
  ArmorTypeId,
  Avatar,
  Character,
  Class,
  ClassEnvoy,
  ClassMechanic,
  ClassMystic,
  ClassOperative,
  ClassSolarian,
  ClassSoldier,
  ClassTechnomancer,
  EquipmentDescriptor,
  FeatTemplate,
  INamedModel,
  Modifier,
  OtherEquipmentDescriptor,
  Prerequisite,
  Profession,
  Race,
  SavingThrow,
  SavingThrowId,
  Size,
  Spell,
  Theme,
  Variant,
  WeaponEquipmentDescriptor,
  WeaponTypeId,
} from "model";
import {
  AbilityScoreIds,
  EquipmentCategories,
  ModifierTypes,
  PrerequisiteTypes,
  isCasterId,
  isVariable,
  isWeaponTypeId,
  ofCategory,
  ofType,
} from "model";
import type { ClassFeature, Feat, Feature, ModifierWithSource, RaceFeature, ThemeFeature } from "view";

export class CharacterPresenter {
  private readonly dataSource: IDataSource;
  private readonly character: Character;

  private cachedPrimaryRaceTraits: RaceFeature[] | null = null;
  private cachedSecondaryRaceTraits: RaceFeature[] | null = null;
  private cachedSelectedRaceTraits: RaceFeature[] | null = null;
  private cachedTheme: Theme | null = null;
  private cachedClass: Class | null = null;
  private cachedMinimalAbilityScores: Record<string, number> | null = null;
  private cachedRemainingAbilityScoresPoints: number | null = null;
  private cachedClassSkills: string[] | null = null;
  private cachedModifiers: Modifier[] | null = null;
  private cachedFeats: Feat[] | null = null;

  constructor(dataSource: IDataSource, character: Character) {
    this.dataSource = dataSource;
    this.character = character;
  }

  getLevel(): number {
    return this.character.level;
  }

  async createTemplater(context: object = {}): Promise<Templater> {
    const templater = new Templater({
      shirrenObsessionSkill: "any",
      lashuntaStudentSkill1: "any",
      lashuntaStudentSkill2: "any",
      halforcProfession: "any",
      iconProfession: "any",
      themelessSkill: "any",
      level: this.character.level,
      race: this.character.race,
      theme: this.character.theme,
      class: this.character.class,
      ...this.character.raceOptions,
      ...this.character.themeOptions,
      ...this.character.classOptions,
      ...context,
    });

    const klass = this.getClass();
    if (klass) {
      templater.addToContext("primary", klass.primaryAbilityScore);
      if (klass.id === "envoy" && this.character.classOptions?.envoySkill) {
        const skill = await this.dataSource.get(DataSets.Skills).getOne(this.character.classOptions.envoySkill);
        templater.addToContext("envoySkill", skill.name);
      }
    }

    return templater;
  }

  async getRace(): Promise<Race | undefined> {
    if (!this.character.race) {
      return undefined;
    }

    return await this.dataSource.get(DataSets.Races).findOne(this.character.race);
  }

  async getRaceVariant(): Promise<Variant | undefined> {
    const race = await this.getRace();
    if (!race || !this.character.raceVariant) {
      return undefined;
    }

    return race.variants.find((v) => v.id === this.character.raceVariant);
  }

  getRaceSelectableBonus(): string | undefined {
    return this.character.raceOptions?.selectableBonus ?? undefined;
  }

  getLashuntaStudentSkill1(): string | null {
    return this.character.raceOptions?.lashuntaStudentSkill1 ?? null;
  }

  getLashuntaStudentSkill2(): string | null {
    return this.character.raceOptions?.lashuntaStudentSkill2 ?? null;
  }

  getShirrenObsessionSkill(): string | null {
    return this.character.raceOptions?.shirrenObsessionSkill ?? null;
  }

  getHalforcProfession(): string | null {
    return this.character.raceOptions?.halforcProfession ?? null;
  }

  async getPrimaryRaceTraits(): Promise<RaceFeature[]> {
    const race = await this.getRace();
    if (!race) {
      return [];
    }

    const templater = await this.createTemplater();
    if (!this.cachedPrimaryRaceTraits) {
      this.cachedPrimaryRaceTraits = race.traits.map((t) => templater.convertRaceFeature(t));
    }

    return this.cachedPrimaryRaceTraits;
  }

  async getSecondaryRaceTraits(): Promise<RaceFeature[]> {
    const race = await this.getRace();
    if (!race) {
      return [];
    }

    const templater = await this.createTemplater();
    if (!this.cachedSecondaryRaceTraits) {
      const primaryTraits = await this.getPrimaryRaceTraits();
      const traits = race.secondaryTraits.map((t) => templater.convertRaceFeature(t));
      for (const trait of traits) {
        const source = findOrError(race.secondaryTraits, trait.id);
        trait.replace =
          source.replace?.map((r) => ({ id: r, name: primaryTraits.find((p) => p.id === r)?.name ?? r })) ?? [];
      }

      this.cachedSecondaryRaceTraits = traits;
    }

    return this.cachedSecondaryRaceTraits;
  }

  async getSelectedRaceTraits(): Promise<Feature[]> {
    const race = await this.getRace();
    if (!race) {
      return [];
    }

    if (!this.cachedSelectedRaceTraits) {
      const templater = await this.createTemplater();
      this.cachedSelectedRaceTraits = [...race.traits, ...race.secondaryTraits]
        .filter((t) => this.character.traits.includes(t.id))
        .map((t) => templater.convertRaceFeature(t));
    }

    return this.cachedSelectedRaceTraits;
  }

  async getTheme(): Promise<Theme | undefined> {
    if (!this.character.theme) {
      return undefined;
    }

    return await this.dataSource.get(DataSets.Themes).findOne(this.character.theme);
  }

  async getThemeFeatures(): Promise<ThemeFeature[]> {
    const theme = await this.getTheme();
    if (!theme) {
      return [];
    }

    const templater = await this.createTemplater();
    return theme.features.map((f) => templater.convertThemeFeature(f));
  }

  isIcon(): boolean {
    return this.character.theme === "icon";
  }

  getIconProfession(): Profession | null {
    if (!this.character.themeOptions?.iconProfession) {
      return null;
    }

    return findOrError(this.character.professionSkills, (p) => p.id === this.character.themeOptions?.iconProfession);
  }

  isScholar(): boolean {
    return this.character.theme === "scholar";
  }

  getScholarDetails(): { skill: string; specialization: string } | null {
    const themeOptions = this.character.themeOptions;
    if (!themeOptions?.scholarSkill || themeOptions.scholarSpecialization === undefined) {
      return null;
    }

    return {
      skill: themeOptions.scholarSkill,
      specialization: themeOptions.scholarSpecialization,
    };
  }

  isThemeless(): boolean {
    return this.character.theme === "themeless";
  }

  getThemelessAbilityScore(): string | null {
    return this.character.themeOptions?.themelessAbility ?? null;
  }

  getThemelessSkill(): string | null {
    return this.character.themeOptions?.themelessSkill ?? null;
  }

  getClass(): Class | null {
    if (!this.character.class) {
      return null;
    }
    if (!this.cachedClass) {
      this.cachedClass = this.data.classes.find((c) => c.id === this.character.class) ?? null;
    }
    return this.cachedClass;
  }

  getClassFeatures(): ClassFeature[] {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return [];
    }

    // Retrieve the class details
    const classDetails = this.classesDetails[selectedClass.id];
    if (!classDetails) {
      console.error("Missing class details for " + selectedClass.id); // eslint-disable-line no-console
      return [];
    }

    switch (classDetails.id) {
      case "envoy":
        return (classDetails as ClassEnvoy).features.map((f) => {
          const level = f.level ?? 1;
          const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertClassFeature(f);
        });

      case "mechanic":
        return getMechanicFeatureTemplates(classDetails as ClassMechanic).map((f) => {
          const level = f.level ?? 1;
          const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertClassFeature(f);
        });

      case "mystic":
        return getMysticFeatureTemplates(classDetails as ClassMystic, this).map((f) => {
          const level = f.level ?? 1;
          const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertClassFeature(f);
        });

      case "operative": {
        const selectedSpecialization = (classDetails as ClassOperative).specializations.find(
          (s) => s.id === this.getOperativeSpecialization()
        );
        return getOperativeFeatureTemplates(classDetails as ClassOperative, this).map((f) => {
          const level = f.level ?? 1;
          const templater = this.createTemplater({
            ...(selectedSpecialization?.variables ?? {}),
            ...cleanEvolutions(f.evolutions)[level],
          });
          return templater.convertClassFeature(f);
        });
      }

      case "solarian": {
        const manifestation = this.getSolarianManifestation();
        return getSolarianFeatureTemplates(classDetails as ClassSolarian)
          .filter((f) => !f.prerequisites || f.prerequisites.length === 0 || f.prerequisites[0].value === manifestation)
          .map((f) => {
            const level = f.level ?? 1;
            const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
            return templater.convertClassFeature(f);
          });
      }

      case "soldier":
        return getSoldierFeatureTemplates(classDetails as ClassSoldier, this).map((f) => {
          const level = f.level ?? 1;
          const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertClassFeature(f);
        });

      case "technomancer":
        return getTechnomancerFeatureTemplates(classDetails as ClassTechnomancer).map((f) => {
          const level = f.level ?? 1;
          const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertClassFeature(f);
        });

      default:
        return [];
    }
  }

  getEnvoySkill(): string | null {
    return this.character.classOptions?.envoySkill ?? null;
  }

  getMechanicStyle(): string | null {
    return this.character.classOptions?.mechanicStyle ?? null;
  }

  getMysticConnection(): string | null {
    return this.character.classOptions?.mysticConnection ?? null;
  }

  getOperativeSpecialization(): string | null {
    return this.character.classOptions?.operativeSpecialization ?? null;
  }

  getSolarianColor(): string | null {
    return this.character.classOptions?.solarianColor ?? null;
  }

  getSolarianManifestation(): string | null {
    return this.character.classOptions?.solarianManifestation ?? null;
  }

  getSolarianDamageType(): string | null {
    return this.character.classOptions?.solarianDamageType ?? null;
  }

  isSoldier(): boolean {
    return this.character.class === "soldier";
  }

  getSoldierAbilityScore(): string | null {
    return this.character.classOptions?.soldierAbilityScore ?? null;
  }

  getSoldierPrimaryStyle(): string | null {
    return this.character.classOptions?.soldierPrimaryStyle ?? null;
  }

  getAbilityScores(): Record<string, number> {
    return this.character.abilityScores;
  }

  getPrimaryAbilityScore(): string {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return "";
    }

    const templater = this.createTemplater();
    return templater.convertString(selectedClass.primaryAbilityScore);
  }

  getSecondaryAbilityScores(): string[] {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return [];
    }

    const templater = this.createTemplater();
    return selectedClass.secondaryAbilityScores.map((s) => templater.convertString(s));
  }

  getMinimalAbilityScores(): Record<string, number> {
    if (!this.cachedMinimalAbilityScores) {
      this.cachedMinimalAbilityScores = computeMinimalAbilityScores(this.data, this.character);
    }

    return this.cachedMinimalAbilityScores;
  }

  getRemainingAbilityScoresPoints(): number {
    if (!this.cachedRemainingAbilityScoresPoints) {
      let points = 10;
      const abilityScores = this.getAbilityScores();
      const minimalAbilityScores = this.getMinimalAbilityScores();
      this.data.abilityScores.forEach((abilityScore) => {
        const minimalScore = minimalAbilityScores[abilityScore.id];
        if (abilityScores[abilityScore.id] > minimalScore) {
          points -= abilityScores[abilityScore.id] - minimalScore;
        }
      });

      this.cachedRemainingAbilityScoresPoints = points;
    }
    return this.cachedRemainingAbilityScoresPoints;
  }

  /**
   * Retrieves all the modifiers for the current character based on its race, theme, class, level and choices.
   * The provided modifier list is updated to ensure that all templates are managed.
   *
   * @returns The list of modifiers that apply to the character.
   */
  getInheritedModifiers(): Modifier[] {
    const selectedRaceTraits = this.getSelectedRaceTraits();
    const themeFeatures = this.getThemeFeatures();
    const classFeatures = this.getClassFeatures();
    const characterFeatures = [...selectedRaceTraits, ...themeFeatures, ...classFeatures];

    const raceModifiers = this.getRace()?.modifiers ?? [];
    const classModifiers = this.getClass()?.modifiers ?? [];
    const featureModifiers = characterFeatures
      .filter((f) => f.level <= this.getLevel())
      .map((t) => t.modifiers)
      .flat();

    return featureModifiers
      .concat(raceModifiers)
      .concat(classModifiers)
      .filter((t) => t && (t.level === undefined || t.level <= this.getLevel()));
  }

  getInheritedModifiersWithSource(): ModifierWithSource[] {
    const selectedRaceTraits = this.getSelectedRaceTraits();
    const themeFeatures = this.getThemeFeatures();
    const classFeatures = this.getClassFeatures();
    const characterFeatures = [...selectedRaceTraits, ...themeFeatures, ...classFeatures];

    const raceModifiers: ModifierWithSource[] = (this.getRace()?.modifiers ?? []).map((m) => ({
      ...m,
      source: this.getRace()!,
    }));
    const classModifiers: ModifierWithSource[] = (this.getClass()?.modifiers ?? []).map((m) => ({
      ...m,
      source: this.getClass()!,
    }));
    const featureModifiers: ModifierWithSource[] = characterFeatures
      .filter((f) => f.level <= this.getLevel())
      .map((t) => t.modifiers.map((m) => ({ ...m, source: t })))
      .flat();

    return featureModifiers
      .concat(raceModifiers)
      .concat(classModifiers)
      .filter((t) => t && (t.level === undefined || t.level <= this.getLevel()));
  }

  /**
   * Retrieves all the modifiers for the current character based on its race, theme, class, level and choices.
   * The provided modifier list is updated to ensure that all templates are managed.
   *
   * @returns The list of modifiers that apply to the character.
   */
  getModifiers(): Modifier[] {
    if (this.cachedModifiers === null) {
      const featModifiers = this.getFeats()
        .map((f) => f.modifiers)
        .flat();
      this.cachedModifiers = [...this.getInheritedModifiers(), ...featModifiers];
    }

    return this.cachedModifiers;
  }

  getModifiersWithSource(): ModifierWithSource[] {
    const featModifiers = this.getFeats()
      .map((f) => f.modifiers.map((m) => ({ ...m, source: f })))
      .flat();
    return [...this.getInheritedModifiersWithSource(), ...featModifiers];
  }

  getClassSkills(): string[] {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return [];
    }

    if (!this.cachedClassSkills) {
      const modifiers = this.getModifiers();
      this.cachedClassSkills = modifiers.filter(ofType(ModifierTypes.classSkill)).map((m) => m.target);
    }

    return this.cachedClassSkills;
  }

  getAllProfessions(): Profession[] {
    return [...this.data.professions, ...this.character.professionSkills];
  }

  getProfessionSkills(): SkillPresenter[] {
    const professionSkills = this.character.professionSkills;
    const builder = new SkillPresenterBuilder(this, this.data);
    return builder.buildProfessions(professionSkills);
  }

  getGenericSkills(): SkillPresenter[] {
    const builder = new SkillPresenterBuilder(this, this.data);
    return builder.buildSkills(this.data.skills.filter((s) => s.abilityScore !== undefined));
  }

  getSkills(): SkillPresenter[] {
    return [...this.getGenericSkills(), ...this.getProfessionSkills()].sort((a, b) =>
      a.fullName.localeCompare(b.fullName, "fr")
    );
  }

  getSkillRanks(skillId: string): number {
    return this.character.skillRanks[skillId] ?? 0;
  }

  getRemainingSkillRanksPoints(): number {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return 0;
    }

    const ranks = this.getModifiers().filter(ofType(ModifierTypes.rank)).length;
    const skillRanks = selectedClass.skillRank + computeAbilityScoreModifier(this.getAbilityScores().int) + ranks;

    return skillRanks - Object.values(this.character.skillRanks).reduce((acc, v) => acc + v, 0);
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  checkPrerequisite(prerequisite: Prerequisite): boolean {
    switch (prerequisite.type) {
      case PrerequisiteTypes.abilityScore: {
        const abilityScore = this.getAbilityScores()[prerequisite.target];
        return abilityScore >= prerequisite.value;
      }

      case PrerequisiteTypes.armorProficiency: {
        const selectedClass = this.getClass();
        return !!selectedClass && selectedClass.armors.includes(prerequisite.target);
      }

      case PrerequisiteTypes.arms: {
        const count =
          findOrError(this.data.bodyParts, "arm").default +
          this.getModifiers()
            .filter(ofType(ModifierTypes.bodyPart))
            .filter((m) => m.target === "arm")
            .reduce((acc, m) => acc + m.value, 0);
        return count >= prerequisite.value;
      }

      case PrerequisiteTypes.baseAttack: {
        const baseAttack = this.getAttackBonuses()?.base;
        return baseAttack !== undefined && baseAttack >= prerequisite.value;
      }
      case PrerequisiteTypes.class:
        if (prerequisite.target.startsWith("!")) {
          return this.character.class !== prerequisite.target.substring(1);
        } else {
          return this.character.class === prerequisite.target;
        }

      case PrerequisiteTypes.combatFeatCount:
        return this.getSelectedFeats().filter((f) => f.combatFeat).length >= prerequisite.value;

      case PrerequisiteTypes.feat: {
        if (prerequisite.target.startsWith("!")) {
          const target = this.data.feats.find((f) => f.id === prerequisite.target.substring(1));
          return !!target && !this.hasFeat(target);
        } else if (prerequisite.target.startsWith("*")) {
          return this.character.feats.some((f) => f.id.startsWith(prerequisite.target.substring(1)));
        } else {
          const target = findOrError(this.data.feats, prerequisite.target);
          return this.hasFeat(target);
        }
      }

      case PrerequisiteTypes.level:
        return this.character.level >= prerequisite.value;

      case PrerequisiteTypes.skillRank: {
        const skill = this.getSkills().find((s) => s.id === prerequisite.target);
        return !!skill && skill.ranks >= prerequisite.value;
      }

      case PrerequisiteTypes.weaponProficiency: {
        const modifiers = this.getWeaponProficiencies();
        const target = isVariable(prerequisite.target)
          ? this.createTemplater().convertString(prerequisite.target)
          : prerequisite.target;

        if (!isWeaponTypeId(target)) {
          Sentry.captureMessage(
            `Invalid weapon type id: ${target} for prerequisite ${prerequisite.id} with value ${prerequisite.target}`
          );
          return false;
        }

        return modifiers.includes(target);
      }

      case PrerequisiteTypes.savingThrow:
        return (this.getSavingThrowBonus(prerequisite.target) ?? 0) >= prerequisite.value;

      case PrerequisiteTypes.notSpellCaster:
        return !isCasterId(this.character.class);

      case PrerequisiteTypes.spellCaster:
        return isCasterId(this.character.class);

      case PrerequisiteTypes.spellCasterLevel:
        // TODO: Manage spell caster level
        return true;
    }
  }

  checkPrerequisites(template: FeatTemplate, target?: INamedModel): boolean {
    if (template.prerequisites === undefined || template.prerequisites.length === 0) {
      return true;
    }

    if (template.type === "simple") {
      return template.prerequisites.every((p) => this.checkPrerequisite(p));
    } else if (template.type === "targeted" || template.type === "multiple") {
      const feat = this.createTemplater().convertFeat(template, target);
      return feat.prerequisites.every((p) => this.checkPrerequisite(p));
    } else {
      // @ts-expect-error Will be called only if a new template type is added and not managed
      Sentry.captureMessage(`Invalid feat template type: ${template.type}`);
      return false;
    }
  }

  getName(): string {
    return this.character.name;
  }

  getAlignment(): string {
    return this.character.alignment;
  }

  getSize(): Size {
    const modifiers = this.getModifiers().filter(ofType(ModifierTypes.size));
    if (modifiers.length === 0) {
      return findOrError(this.data.sizes, "medium");
    } else {
      return findOrError(this.data.sizes, modifiers[0].target);
    }
  }

  /**
   * Computes the speed of the character in number of case.
   *
   * @returns The speed of the character in case.
   */
  getSpeed(): number {
    const defaultSpeed = 6;
    const modifiers = this.getModifiers().filter(ofType(ModifierTypes.speed));
    return modifiers.reduce((acc, m) => acc + m.value, defaultSpeed);
  }

  getSex(): string {
    return this.character.sex;
  }

  getHomeWorld(): string {
    return this.character.homeWorld;
  }

  getHomeWorldLanguage(): string {
    return this.character.homeWorldLanguage;
  }

  getExtraLanguagesCount(): number {
    const modifier = this.getModifiers()
      .filter(ofType(ModifierTypes.languageCount))
      .reduce((acc, m) => acc + m.value, 0);
    const intBonus = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.int]);
    const cultRanks = this.character.skillRanks.cult ?? 0;

    return modifier + Math.max(0, intBonus) + cultRanks;
  }

  getLanguages(): string[] {
    return this.character.languages;
  }

  getDeity(): string {
    return this.character.deity;
  }

  getDescription(): string {
    return this.character.description;
  }

  getAvatar(): Avatar | null {
    if (!this.character.avatar) {
      return null;
    } else {
      return findOrError(this.data.avatars, this.character.avatar);
    }
  }

  getAttackBonuses(): { base: number; melee: number; ranged: number; thrown: number } | undefined {
    const klass = this.getClass();
    if (!klass) {
      return undefined;
    }

    const base = computeBaseAttackBonus(this.character.level, klass.baseAttack);
    const str = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.str]);
    const dex = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.dex]);
    return {
      base,
      melee: base + str,
      ranged: base + dex,
      thrown: base + str,
    };
  }

  getArmorProficiencies(): ArmorTypeId[] {
    const selectedClass = this.getClass();
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierTypes.armorProficiency))
      .map((m) => m.target);

    return [...(selectedClass?.armors ?? []), ...modifiers];
  }

  getWeaponProficiencies(): WeaponTypeId[] {
    const fromModifiers = this.getModifiers()
      .filter(ofType(ModifierTypes.weaponProficiency))
      .map((m) => m.target);

    return Array.from(new Set(fromModifiers));
  }

  /**
   * Retrieves the feats that are inherited (and not removeable) from the current race, theme or class.
   * @returns The list of inherited feats.
   */
  getInheritedFeats(): Feat[] {
    const modifiers = this.getInheritedModifiers().filter(ofType(ModifierTypes.feat));
    const templater = this.createTemplater();

    return modifiers.map((m) => {
      const template = findOrError(this.data.feats, (f) => f.id === m.feat);
      if (m.target === undefined || template.type === "simple") {
        return templater.convertFeat(template);
      } else {
        const options = new FeatPresenter(this.data, this).retrieveOptions(template.targetType);
        const target = findOrError(options, (o) => o.id === m.target);
        return templater.convertFeat(template, target);
      }
    });
  }

  getSelectedFeats(): Feat[] {
    const templater = this.createTemplater();
    const featPresenter = new FeatPresenter(this.data, this);

    return this.character.feats.map((f) => {
      const template = findOrError(this.data.feats, (t) => t.id === f.id);
      if (f.target === undefined || template.type === "simple") {
        return templater.convertFeat(template);
      } else {
        const options = featPresenter.retrieveOptions(template.targetType);
        const target = findOrError(options, (o) => o.id === f.target);
        return templater.convertFeat(template, target);
      }
    });
  }

  getFeats(): Feat[] {
    if (this.cachedFeats === null) {
      this.cachedFeats = [...this.getInheritedFeats(), ...this.getSelectedFeats()];
    }
    return this.cachedFeats;
  }

  hasFeat(feat: FeatTemplate, target?: string): boolean {
    const feats = this.getFeats();
    if (target === undefined) {
      return feats.some((f) => f.id === feat.id);
    } else {
      return feats.some((f) => f.id === feat.id && f.target === target);
    }
  }

  getSelectableFeatCount(): number {
    const bonus = this.getModifiers()
      .filter(ofType(ModifierTypes.featCount))
      .reduce((acc, m) => acc + m.value, 0);
    const selected = this.character.feats.length;
    return 1 + bonus - selected;
  }

  getSelectedSpells(): Record<string, Spell[]> {
    const levels = Object.keys(this.character.spells);
    const spells = levels.map((level) => [
      level,
      this.character.spells[level].map((s) => findOrError(this.data.spells, s)),
    ]);
    return Object.fromEntries(spells);
  }

  getSelectableSpellCount(spellLevel: number): number {
    const low = [2, 3, 4, 4, 5];
    const high = [2, 3, 4, 4, 4, 4, 5, 5, 5, 5];

    let max: number;
    if (!isCasterId(this.character.class)) {
      max = 0;
    } else if (spellLevel === 0) {
      max = low[this.character.level + 2] ?? 6;
    } else if (spellLevel === 6) {
      max = this.character.level <= 15 ? 0 : (low[this.character.level - 16] ?? 6);
    } else {
      const minLevel = (spellLevel - 1) * 3;
      max = this.character.level <= minLevel ? 0 : (high[this.character.level - minLevel - 1] ?? 6);
    }

    return max;
  }

  getInitiative(): number {
    const dex = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.dex]);
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierTypes.initiative))
      .reduce((acc, m) => acc + m.value, 0);
    return dex + modifiers;
  }

  getStaminaPoints(): number {
    const con = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.con]);
    const klass = this.getClass()?.staminaPoints ?? 0;
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierTypes.stamina))
      .reduce((acc, m) => acc + m.value, 0);

    return Math.max(0, con + klass + modifiers);
  }

  getHitPoints(): number {
    const klass = this.getClass()?.hitPoints ?? 0;
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierTypes.hitPoints))
      .reduce((acc, m) => acc + m.value, 0);

    return Math.max(1, klass + modifiers);
  }

  getResolvePoints(): number {
    const level = Math.max(1, Math.floor(this.character.level / 2));
    const primaryAbilityScore = this.getPrimaryAbilityScore();
    const primary = primaryAbilityScore ? computeAbilityScoreModifier(this.getAbilityScores()[primaryAbilityScore]) : 0;
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierTypes.resolve))
      .reduce((acc, m) => acc + m.value, 0);

    return level + primary + modifiers;
  }

  getEnergyArmorClass(): number {
    const dex = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.dex]);
    return 10 + dex;
  }

  getKineticArmorClass(): number {
    const dex = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.dex]);
    return 10 + dex;
  }

  getArmorClassAgainstCombatManeuvers(): number {
    return 8 + this.getKineticArmorClass();
  }

  getSavingThrowBonus(savingThrowOrId: SavingThrow | SavingThrowId): number | undefined {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return undefined;
    }

    const savingThrow =
      typeof savingThrowOrId === "string" ? findOrError(this.data.savingThrows, savingThrowOrId) : savingThrowOrId;
    const classBonus = computeSavingThrowBonus(this.getLevel(), selectedClass.savingThrows[savingThrow.id]);
    const abilityScoreBonus = computeAbilityScoreModifier(this.getAbilityScores()[savingThrow.abilityScore]);
    const otherBonus = this.getModifiers()
      .filter(ofType(ModifierTypes.savingThrowBonus))
      .filter((b) => b.target === savingThrow.id)
      .reduce((a, c) => a + c.value, 0);

    return classBonus + abilityScoreBonus + otherBonus;
  }

  getInitialCapital(): number {
    return this.character.initialCapital;
  }

  getCredits(): number {
    return this.character.credits;
  }

  getEquipment(id: string): EquipmentDescriptor {
    return findOrError(this.character.equipment, id);
  }

  getWeapons(): WeaponEquipmentDescriptor[] {
    return this.character.equipment.filter(ofCategory(EquipmentCategories.weapon));
  }

  getArmors(): ArmorEquipmentDescriptor[] {
    return this.character.equipment.filter(ofCategory(EquipmentCategories.armor));
  }

  getEquipmentOthers(): OtherEquipmentDescriptor[] {
    return this.character.equipment.filter(ofCategory(EquipmentCategories.other));
  }
}
