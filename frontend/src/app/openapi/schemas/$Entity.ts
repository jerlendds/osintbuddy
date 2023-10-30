/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Entity = {
  properties: {
    label: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    author: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    description: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    source: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    is_favorite: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
    id: {
      type: 'number',
      isRequired: true,
    },
    uuid: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
    },
    last_edited: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    updated: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    created: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
