/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Loginv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Account
   * @returns any Successful Response
   * @throws ApiError
   */
  public getAccount(): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/get-account',
    });
  }

  /**
   * Post Signin
   * @param code
   * @returns any Successful Response
   * @throws ApiError
   */
  public postSignin(
    code: string,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/sign-in',
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
   * @returns any Successful Response
   * @throws ApiError
   */
  public postSignout(): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/sign-out',
    });
  }

}
