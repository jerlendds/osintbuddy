/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $User = {
  properties: {
    email: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'email',
      }, {
        type: 'null',
      }],
    },
    is_active: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
    is_superuser: {
      type: 'boolean',
    },
    full_name: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    id: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    modified: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    created: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
  },
} as const;
