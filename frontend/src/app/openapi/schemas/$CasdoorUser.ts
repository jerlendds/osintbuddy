/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CasdoorUser = {
  properties: {
    id: {
      type: 'string',
      isRequired: true,
      format: 'uuid',
    },
    sub: {
      type: 'string',
      isRequired: true,
      format: 'uuid',
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    displayName: {
      type: 'string',
      isRequired: true,
    },
    firstName: {
      type: 'string',
      isRequired: true,
    },
    lastName: {
      type: 'string',
      isRequired: true,
    },
    avatar: {
      type: 'string',
      isRequired: true,
    },
    avatarType: {
      type: 'string',
      isRequired: true,
    },
    permanentAvatar: {
      type: 'string',
      isRequired: true,
    },
    email: {
      type: 'string',
      isRequired: true,
    },
    emailVerified: {
      type: 'boolean',
      isRequired: true,
    },
    phone: {
      type: 'string',
      isRequired: true,
    },
    countryCode: {
      type: 'string',
      isRequired: true,
    },
    region: {
      type: 'string',
      isRequired: true,
    },
    location: {
      type: 'string',
      isRequired: true,
    },
    bio: {
      type: 'string',
      isRequired: true,
    },
    language: {
      type: 'string',
      isRequired: true,
    },
    aud: {
      type: 'array',
      contains: {
        type: 'string',
      },
    },
    exp: {
      type: 'number',
      isRequired: true,
    },
    nbf: {
      type: 'number',
      isRequired: true,
    },
    iat: {
      type: 'number',
      isRequired: true,
    },
    jti: {
      type: 'string',
      isRequired: true,
    },
    isOnline: {
      type: 'boolean',
      isRequired: true,
    },
    isAdmin: {
      type: 'boolean',
      isRequired: true,
    },
    isForbidden: {
      type: 'boolean',
      isRequired: true,
    },
    isDeleted: {
      type: 'boolean',
      isRequired: true,
    },
    owner: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    signupApplication: {
      type: 'string',
    },
    createdTime: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    updatedTime: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
  },
} as const;
