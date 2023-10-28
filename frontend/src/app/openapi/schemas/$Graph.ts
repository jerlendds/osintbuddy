/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Graph = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    description: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    is_favorite: {
      type: 'boolean',
    },
    uuid: {
      type: 'string',
      isRequired: true,
      format: 'uuid',
    },
    updated: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    created: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    last_seen: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
  },
} as const;
