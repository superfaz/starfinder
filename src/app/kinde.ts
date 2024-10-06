import type {
  KindeAccessToken,
  KindeFlag,
  KindeFlagRaw,
  KindeFlagTypeCode,
  KindeFlagTypeValue,
  KindeIdToken,
  KindeOrganization,
  KindeOrganizations,
  KindePermission,
  KindePermissions,
  KindeState,
} from "@kinde-oss/kinde-auth-nextjs/dist/types.js";
import { useCallback, useEffect, useState } from "react";

const flagDataTypeMap: Record<KindeFlagTypeCode, KindeFlagTypeValue> = {
  b: "boolean",
  i: "integer",
  s: "string",
  j: "json",
};

type KindeStateData = Omit<
  KindeState,
  | "getUser"
  | "getIdTokenRaw"
  | "getPermission"
  | "getBooleanFlag"
  | "getIntegerFlag"
  | "getFlag"
  | "getStringFlag"
  | "getClaim"
  | "getAccessToken"
  | "getToken"
  | "getAccessTokenRaw"
  | "getIdToken"
  | "getOrganization"
  | "getPermissions"
  | "getUserOrganizations"
  | "refreshData"
> & { featureFlags: Record<string, KindeFlagRaw> };

export const useKindeBrowserClient = (
  apiPath: string = process.env.NEXT_PUBLIC_KINDE_AUTH_API_PATH ?? process.env.KINDE_AUTH_API_PATH ?? "/api/auth",
  isDebugMode: boolean = process.env.NEXT_PUBLIC_KINDE_AUTH_DEBUG_MODE === "true" ||
    process.env.KINDE_AUTH_DEBUG_MODE === "true"
): KindeState => {
  const [state, setState] = useState<KindeStateData>({
    accessToken: null,
    accessTokenEncoded: null,
    accessTokenRaw: null,
    error: null,
    idToken: null,
    idTokenEncoded: null,
    idTokenRaw: null,
    isAuthenticated: false,
    isLoading: true,
    organization: { orgCode: null },
    permissions: { permissions: [], orgCode: null },
    user: null,
    userOrganizations: {
      orgCodes: [],
      orgs: [],
    },
    featureFlags: {},
  });

  const refreshData = useCallback(async () => {
    const setupUrl = `${apiPath}/setup`;
    const res = await fetch(setupUrl);
    const kindeData = await res.json();

    if (res.ok) {
      setState({ ...kindeData, isLoading: false });
    } else {
      setState((prev) => ({ ...prev, isLoading: false, error: res.statusText || "An error occurred" }));
    }
  }, [apiPath]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getFlag = (code: string, defaultValue: string | number | boolean, flagType: KindeFlagTypeCode): KindeFlag => {
    const flags = state.featureFlags || {};
    const flag: KindeFlagRaw | undefined = flags && flags[code] ? flags[code] : undefined;

    if (flag === undefined && defaultValue == undefined) {
      throw Error(`Flag ${code} was not found, and no default value has been provided`);
    }

    if (flag?.t && flagType !== flag.t) {
      throw Error(`Flag ${code} is of type ${flagDataTypeMap[flag.t]} - requested type ${flagDataTypeMap[flagType]}`);
    }

    return {
      code,
      type: flagDataTypeMap[flag?.t ?? flagType],
      value: flag?.v ?? defaultValue,
      is_default: !flag?.v,
      defaultValue: defaultValue,
    };
  };

  const getBooleanFlag = (code: string, defaultValue: boolean): boolean | undefined => {
    try {
      const flag = getFlag(code, defaultValue, "b");
      return flag.value;
    } catch (err) {
      if (isDebugMode) {
        console.error(err);
      }
    }
  };

  const getStringFlag = (code: string, defaultValue: string): string | undefined => {
    try {
      const flag = getFlag(code, defaultValue, "s");
      return flag.value;
    } catch (err) {
      if (isDebugMode) {
        console.error(err);
      }
      throw err;
    }
  };

  const getIntegerFlag = (code: string, defaultValue: number): number | undefined => {
    try {
      const flag = getFlag(code, defaultValue, "i");
      return flag.value;
    } catch (err) {
      if (isDebugMode) {
        console.error(err);
      }
      throw err;
    }
  };

  const getClaim = (
    claim: string,
    tokenKey: "access_token" | "id_token" = "access_token"
  ): { name: string; value: string } | null => {
    const token = tokenKey === "access_token" ? state.accessToken : state.idToken;

    // Hack for type conversion
    const record = token as unknown as Record<string, string>;

    return token ? { name: claim, value: record[claim] } : null;
  };

  const getAccessToken = (): KindeAccessToken | null => {
    return state.accessToken;
  };

  const getToken = (): string | null => {
    return state.accessTokenEncoded;
  };

  const getAccessTokenRaw = (): string | null => {
    return state.accessTokenEncoded;
  };

  const getIdTokenRaw = (): string | null => {
    return state.idTokenRaw;
  };

  const getIdToken = (): KindeIdToken | null => {
    return state.idToken;
  };
  const getOrganization = (): KindeOrganization => {
    return state.organization;
  };

  const getPermissions = (): KindePermissions => {
    return state.permissions;
  };

  const getUserOrganizations = (): KindeOrganizations => {
    return state.userOrganizations;
  };

  const getPermission = (key: string): KindePermission => {
    if (!state.permissions) return { isGranted: false, orgCode: null };

    return {
      isGranted: state.permissions.permissions?.some((p) => p === key),
      orgCode: state.organization?.orgCode,
    };
  };

  return {
    ...state,
    isAuthenticated: !!state.user,
    getUser: () => state.user,
    getIdTokenRaw,
    getPermission,
    getBooleanFlag,
    getIntegerFlag,
    getFlag,
    getStringFlag,
    getClaim,
    getAccessToken,
    getToken,
    getAccessTokenRaw,
    getIdToken,
    getOrganization,
    getPermissions,
    getUserOrganizations,
    refreshData,
  };
};
