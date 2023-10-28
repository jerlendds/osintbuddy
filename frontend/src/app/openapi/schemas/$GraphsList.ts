/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GraphsList = {
  properties: {
    graphs: {
      type: 'array',
      contains: {
        type: 'Graph',
      },
      isRequired: true,
    },
    count: {
      type: 'number',
      isRequired: true,
    },
  },
} as const;
