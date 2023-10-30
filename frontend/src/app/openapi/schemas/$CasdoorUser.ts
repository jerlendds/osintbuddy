/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CasdoorUser = {
  properties: {
    owner: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    signupApplication: {
      type: 'string',
    },
    id: {
      type: 'string',
      isRequired: true,
      format: 'uuid',
    },
    sub: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
    },
    exp: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    nbf: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    iat: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    jti: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    aud: {
      type: 'array',
      contains: {
        type: 'string',
      },
    },
    avatar: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    avatarType: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    permanentAvatar: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    firstName: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    lastName: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    displayName: {
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
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    countryCode: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    region: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    location: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    bio: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    language: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    isOnline: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
    isAdmin: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
    isForbidden: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
    isDeleted: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
    updatedTime: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    createdTime: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
  },
} as const;
