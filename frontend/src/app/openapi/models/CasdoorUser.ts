/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CasdoorUser = {
  id: string;
  sub: string;
  name: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  avatarType: string;
  permanentAvatar: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  countryCode: string;
  region: string;
  location: string;
  bio: string;
  language: string;
  aud?: Array<string>;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  isOnline: boolean;
  isAdmin: boolean;
  isForbidden: boolean;
  isDeleted: boolean;
  owner?: string;
  type?: string;
  signupApplication?: string;
  createdTime: string;
  updatedTime: string;
};

