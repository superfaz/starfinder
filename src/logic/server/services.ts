import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { convert, fail, PromisedResult, start, succeed } from "chain-of-actions";
import { redirect } from "next/navigation";
import { ZodError, ZodType, ZodTypeDef } from "zod";
import { DataSets, DataSource, IDataSource } from "data";
import { DataSourceError, ParsingError, UnauthorizedError } from "logic/errors";
import type {
  AbilityScore,
  Alignment,
  ArmorType,
  Avatar,
  BodyPart,
  BonusCategory,
  Book,
  Class,
  CriticalHitEffect,
  DamageType,
  EquipmentMaterial,
  FeatTemplate,
  Profession,
  Race,
  SavingThrow,
  Size,
  SkillDefinition,
  Spell,
  Theme,
  WeaponCategory,
  WeaponSpecialProperty,
  WeaponType,
} from "model";
import { ViewBuilder } from "view/server";

export function parse<T, D extends ZodTypeDef, I>(
  schema: ZodType<T, D, I>,
  data: unknown
): PromisedResult<T, ParsingError> {
  return convert({
    try: async () => schema.parse(data),
    catch: (error) => {
      if (error instanceof ZodError) {
        return new ParsingError(error.flatten().fieldErrors);
      } else {
        throw error;
      }
    },
  });
}

export function hasValidInput<T, D extends ZodTypeDef, I>(
  schema: ZodType<T, D, I>,
  data: unknown
): PromisedResult<{ input: T }, ParsingError> {
  return start()
    .onSuccess(() => parse(schema, data))
    .onSuccess(async (input) => succeed({ input }))
    .runAsync();
}

export function getAuthenticatedUser(): PromisedResult<
  { user: KindeUser<Record<string, unknown>> },
  UnauthorizedError
> {
  return start()
    .onSuccess(() =>
      convert({
        try: () => getKindeServerSession().getUser(),
        catch: () => new UnauthorizedError(),
      })
    )
    .onSuccess((user) => (user ? succeed({ user }) : fail(new UnauthorizedError())))
    .runAsync();
}

export function getDataSource(): PromisedResult<{ dataSource: IDataSource }> {
  return succeed({ dataSource: new DataSource() });
}

export function redirectToSignIn(returnTo: string): never {
  redirect(`/api/auth/login?post_login_redirect_url=${encodeURIComponent(returnTo)}`);
}

export function getViewBuilder({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ viewBuilder: ViewBuilder }> {
  return succeed({ viewBuilder: new ViewBuilder(dataSource) });
}

export async function retrieveAbilityScores({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ abilityScores: AbilityScore[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.AbilityScore).getAll())
    .onSuccess((abilityScores) => succeed({ abilityScores }))
    .runAsync();
}

export async function retrieveAlignments({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ alignments: Alignment[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Alignment).getAll())
    .onSuccess((alignments) => succeed({ alignments }))
    .runAsync();
}

export async function retrieveArmorTypes({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ armorTypes: ArmorType[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.ArmorType).getAll())
    .onSuccess((armorTypes) => succeed({ armorTypes }))
    .runAsync();
}

export async function retrieveAvatars({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ avatars: Avatar[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Avatar).getAll())
    .onSuccess((avatars) => succeed({ avatars }))
    .runAsync();
}

export async function retrieveBodyParts({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ bodyParts: BodyPart[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.BodyParts).getAll())
    .onSuccess((bodyParts) => succeed({ bodyParts }))
    .runAsync();
}

export async function retrieveBonusCategories({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ bonusCategories: BonusCategory[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.BonusCategories).getAll())
    .onSuccess((bonusCategories) => succeed({ bonusCategories }))
    .runAsync();
}

export async function retrieveBooks({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ books: Book[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Book).getAll())
    .onSuccess((books) => succeed({ books }))
    .runAsync();
}

export async function retrieveClasses({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ classes: Class[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Class).getAll())
    .onSuccess((classes) => succeed({ classes }))
    .runAsync();
}

export async function retrieveCriticalHitEffects({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ criticalHitEffects: CriticalHitEffect[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.CriticalHitEffects).getAll())
    .onSuccess((criticalHitEffects) => succeed({ criticalHitEffects }))
    .runAsync();
}

export async function retrieveDamageTypes({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ damageTypes: DamageType[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.DamageTypes).getAll())
    .onSuccess((damageTypes) => succeed({ damageTypes }))
    .runAsync();
}

export async function retrieveEquipmentMaterials({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ equipmentMaterials: EquipmentMaterial[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.EquipmentMaterial).getAll())
    .onSuccess((equipmentMaterials) => succeed({ equipmentMaterials }))
    .runAsync();
}

export async function retrieveFeats({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ feats: FeatTemplate[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Feat).getAll())
    .onSuccess((feats) => succeed({ feats }))
    .runAsync();
}

export async function retrieveProfessions({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ professions: Profession[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Profession).getAll())
    .onSuccess((professions) => succeed({ professions }))
    .runAsync();
}

export async function retrieveRaces({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ races: Race[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Races).getAll())
    .onSuccess((races) => succeed({ races }))
    .runAsync();
}

export async function retrieveSavingThrows({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ savingThrows: SavingThrow[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.SavingThrows).getAll())
    .onSuccess((savingThrows) => succeed({ savingThrows }))
    .runAsync();
}

export async function retrieveSizes({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ sizes: Size[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Sizes).getAll())
    .onSuccess((sizes) => succeed({ sizes }))
    .runAsync();
}

export async function retrieveSkills({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ skills: SkillDefinition[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Skills).getAll())
    .onSuccess((skills) => succeed({ skills }))
    .runAsync();
}

export async function retrieveSpells({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ spells: Spell[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Spells).getAll())
    .onSuccess((spells) => succeed({ spells }))
    .runAsync();
}

export async function retrieveThemes({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ themes: Theme[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.Themes).getAll())
    .onSuccess((themes) => succeed({ themes }))
    .runAsync();
}

export async function retrieveWeaponCategories({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ weaponCategories: WeaponCategory[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.WeaponCategories).getAll())
    .onSuccess((weaponCategories) => succeed({ weaponCategories }))
    .runAsync();
}

export async function retrieveWeaponSpecialProperties({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ weaponSpecialProperties: WeaponSpecialProperty[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.WeaponSpecialProperties).getAll())
    .onSuccess((weaponSpecialProperties) => succeed({ weaponSpecialProperties }))
    .runAsync();
}

export async function retrieveWeaponTypes({
  dataSource,
}: {
  dataSource: IDataSource;
}): PromisedResult<{ weaponTypes: WeaponType[] }, DataSourceError> {
  return await start()
    .onSuccess(() => dataSource.get(DataSets.WeaponTypes).getAll())
    .onSuccess((weaponTypes) => succeed({ weaponTypes }))
    .runAsync();
}
