export enum RaceAdvisorError {
  RaceNotSelected = "Vous devez choisir une race",
}

export interface IAdvisorResult {
  race?: RaceAdvisorError;
}
