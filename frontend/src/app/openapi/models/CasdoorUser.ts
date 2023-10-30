/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CasdoorUser = {
  owner?: string;
  type?: string;
  signupApplication?: string;
  id: string;
  sub?: (string | null);
  exp?: (number | null);
  nbf?: (number | null);
  iat?: (number | null);
  jti?: (string | null);
  aud?: Array<string>;
  avatar: (string | null);
  avatarType: (string | null);
  permanentAvatar: (string | null);
  firstName?: (string | null);
  lastName?: (string | null);
  name: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  phone: (string | null);
  countryCode: (string | null);
  region: (string | null);
  location: (string | null);
  bio: (string | null);
  language?: (string | null);
  isOnline?: (boolean | null);
  isAdmin?: (boolean | null);
  isForbidden?: (boolean | null);
  isDeleted?: (boolean | null);
  updatedTime: string;
  createdTime: string;
};

