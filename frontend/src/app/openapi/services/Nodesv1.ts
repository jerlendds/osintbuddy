/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateNode } from '../models/CreateNode';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Nodesv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Refresh Plugins
   * @returns any Successful Response
   * @throws ApiError
   */
  public refreshPlugins(): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/nodes/refresh',
    });
  }

  /**
   * Get Entity Transforms
   * @param label
   * @returns any Successful Response
   * @throws ApiError
   */
  public getEntityTransforms(
    label: string,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/nodes/transforms',
      query: {
        'label': label,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Graph Entity
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public createGraphEntity(
    requestBody: CreateNode,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/nodes/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
