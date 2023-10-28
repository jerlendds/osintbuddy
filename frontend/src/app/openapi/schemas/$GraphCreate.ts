/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GraphCreate = {
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
  },
} as const;
