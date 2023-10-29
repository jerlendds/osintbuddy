/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Status } from '../models/Status';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Loginv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Post Signin
   * @param code
   * @returns Status Successful Response
   * @throws ApiError
   */
  public postSignin(
    code: string,
  ): CancelablePromise<Status> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/auth/sign-in',
      query: {
        'code': code,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Post Signout
   * @returns Status Successful Response
   * @throws ApiError
   */
  public postSignout(): CancelablePromise<Status> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/auth/sign-out',
    });
  }

}
