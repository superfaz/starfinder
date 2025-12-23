import type { GrantType, ACClientOptions } from "@kinde-oss/kinde-typescript-sdk";

export type ClientOptions = {
  audience?: string | string[];
  clientId?: string;
  clientSecret?: string;
  issuerURL?: string;
  siteUrl?: string;
  postLoginRedirectUrl?: string;
  postLogoutRedirectUrl?: string;
};

export type HandleAuthOptions = {
  onError?: () => void;
  override?: () => Promise<ClientOptions>;
  clientOptions?: ClientOptions;
};

export type HandleAuthConfig = {
  onError?: () => void;
  isDebugMode: boolean;
  grantType: GrantType.AUTHORIZATION_CODE;
  apiPath: string;
  cookieDomain?: string;
  clientConfig: ACClientOptions;
  siteUrl: string;
  issuerURL?: string;
  postLoginRedirectUrl?: string;
  postLogoutRedirectUrl?: string;
};

export type ClaimValue = { v: string };

export type UserProperties = {
  kp_usr_city?: ClaimValue;
  kp_usr_industry?: ClaimValue;
  kp_usr_job_title?: ClaimValue;
  kp_usr_middle_name?: ClaimValue;
  kp_usr_postcode?: ClaimValue;
  kp_usr_salutation?: ClaimValue;
  kp_usr_state_region?: ClaimValue;
  kp_usr_street_address?: ClaimValue;
  kp_usr_street_address_2?: ClaimValue;
};

export type OrgProperties = {
  kp_org_city?: ClaimValue;
  kp_org_industry?: ClaimValue;
  kp_org_postcode?: ClaimValue;
  kp_org_state_region?: ClaimValue;
  kp_org_street_address?: ClaimValue;
  kp_org_street_address_2?: ClaimValue;
};

export type OrgName = {
  id: string;
  name: string;
};
