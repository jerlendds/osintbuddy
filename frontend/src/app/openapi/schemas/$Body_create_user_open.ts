/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Body_create_user_open = {
  properties: {
    password: {
      type: 'string',
      isRequired: true,
    },
    email: {
      type: 'string',
      isRequired: true,
      format: 'email',
    },
    full_name: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
