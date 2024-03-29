import { CosmosClient, Database } from "@azure/cosmos";
import * as Sentry from "@sentry/nextjs";
import {
  AbilityScoreSchema,
  AlignmentSchema,
  ArmorTypeSchema,
  AvatarSchema,
  BookSchema,
  ClassSchema,
  DamageTypeSchema,
  FeatTemplateSchema,
  type IModel,
  type INamedModel,
  ProfessionSchema,
  RaceSchema,
  SavingThrowSchema,
  SkillDefinitionSchema,
  SpellSchema,
  ThemeSchema,
  WeaponCategorySchema,
  WeaponTypeSchema,
  EquipmentWeaponMeleeSchema,
  CriticalHitEffectSchema,
  WeaponSpecialPropertySchema,
} from "model";
import { IDataSet } from ".";
import { cache } from "react";

export class DataSetBuilder {
  private readonly client: CosmosClient;
  private readonly database: Database;

  constructor() {
    if (
      !process.env.STARFINDER_COSMOS_ENDPOINT ||
      !process.env.STARFINDER_COSMOS_KEY ||
      !process.env.STARFINDER_COSMOS_DATABASE
    ) {
      throw new Error("Missing CosmosDB configuration");
    }

    this.client = new CosmosClient({
      endpoint: process.env.STARFINDER_COSMOS_ENDPOINT,
      key: process.env.STARFINDER_COSMOS_KEY,
    });
    this.database = this.client.database(process.env.STARFINDER_COSMOS_DATABASE);
  }

  private async getWithQuery<T extends IModel>(name: string, query: string): Promise<T[]> {
    const preparedQuery = this.database.container(name).items.query(query);
    try {
      const result = await preparedQuery.fetchAll();
      return result.resources as T[];
    } catch (e: unknown) {
      Sentry.captureException(e);
      throw new Error(`Failed to get ${name}`, { cause: e });
    }
  }

  private async getOne<T>(name: string, id: string): Promise<T> {
    const preparedQuery = this.database.container(name).item(id, id);
    try {
      const result = await preparedQuery.read<IModel>();
      return result.resource as T;
    } catch (e: unknown) {
      Sentry.captureException(e);
      throw new Error(`Failed to get ${name}/${id}`, { cause: e });
    }
  }

  async getAll<T extends IModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c");
  }

  async getOrdered<T extends IModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c ORDER BY c['order']");
  }

  async getNamed<T extends INamedModel>(name: string): Promise<T[]> {
    return this.getWithQuery(name, "SELECT * FROM c ORDER BY c.name");
  }

  async build(): Promise<IDataSet> {
    const data: IDataSet = {
      /*get: function <T>(descriptor: Descriptor<T>): Promise<T> {
        switch (descriptor.type) {
          case "simple":
            return cache(() => this.getAll(descriptor.name).then((a) => descriptor.schema.array().parse(a)));
          case "named":
            return this.getNamed(descriptor.name).then((a) => descriptor.schema.array().parse(a));
          case "ordered":
            return this.getOrdered(descriptor.name).then((a) => descriptor.schema.array().parse(a));
          default:
            throw new Error("Method not implemented.");
        }
      },*/
      getAbilityScores: cache(() => this.getOrdered("ability-scores").then((a) => AbilityScoreSchema.array().parse(a))),
      getAlignments: cache(() => this.getOrdered("alignments").then((a) => AlignmentSchema.array().parse(a))),
      getArmorTypes: cache(() => this.getOrdered("armor-types").then((a) => ArmorTypeSchema.array().parse(a))),
      getAvatars: cache(() => this.getAll("avatars").then((a) => AvatarSchema.array().parse(a))),
      getBooks: cache(() => this.getAll("books").then((a) => BookSchema.array().parse(a))),
      getClasses: cache(() => this.getNamed("classes").then((a) => ClassSchema.array().parse(a))),
      getClassDetails: <T>(classId: string) => this.getOne<T>("classes-details", classId),
      getCriticalHitEffects: cache(() =>
        this.getNamed("critical-hit-effects").then((a) => CriticalHitEffectSchema.array().parse(a))
      ),
      getDamageTypes: cache(() => this.getNamed("damage-types").then((a) => DamageTypeSchema.array().parse(a))),
      getEquipmentWeaponMelee: cache(() =>
        this.getAll("equipment-weapon-melee").then((a) => EquipmentWeaponMeleeSchema.array().parse(a))
      ),
      getFeats: cache(() => this.getNamed("feats").then((a) => FeatTemplateSchema.array().parse(a))),
      getProfessions: cache(() => this.getNamed("professions").then((a) => ProfessionSchema.array().parse(a))),
      getRaces: cache(() => this.getNamed("races").then((a) => RaceSchema.array().parse(a))),
      getSpells: cache(() => this.getNamed("spells").then((a) => SpellSchema.array().parse(a))),
      getThemes: cache(() => this.getNamed("themes").then((a) => ThemeSchema.array().parse(a))),
      getThemeDetails: <T>(themeId: string) => this.getOne<T>("themes-details", themeId),
      getSavingThrows: cache(() => this.getOrdered("saving-throws").then((a) => SavingThrowSchema.array().parse(a))),
      getSkills: cache(() => this.getNamed("skills").then((a) => SkillDefinitionSchema.array().parse(a))),
      getWeaponCategories: cache(() =>
        this.getNamed("weapon-categories").then((a) => WeaponCategorySchema.array().parse(a))
      ),
      getWeaponSpecialProperties: cache(() =>
        this.getNamed("weapon-special-properties").then((a) => WeaponSpecialPropertySchema.array().parse(a))
      ),
      getWeaponTypes: cache(() => this.getOrdered("weapon-types").then((a) => WeaponTypeSchema.array().parse(a))),
    };

    return data;
  }
}
