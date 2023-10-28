/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Defaultv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Status
   * @returns any Successful Response
   * @throws ApiError
   */
  public getStatus(): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/status',
    });
  }

}
