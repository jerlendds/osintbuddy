/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CasdoorUser } from '../models/CasdoorUser';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Usersv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Account
   * @returns CasdoorUser Successful Response
   * @throws ApiError
   */
  public getAccount(): CancelablePromise<CasdoorUser> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/account/',
    });
  }

}
