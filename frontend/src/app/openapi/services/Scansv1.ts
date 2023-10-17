/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScanMachineCreate } from '../models/ScanMachineCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Scansv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Create Scan Machine
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public createScanMachineApiV1ScansMachinesPost(
    requestBody: ScanMachineCreate,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/scans/machines',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Scan Machines
   * @param skip
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public getScanMachinesApiV1ScansMachinesGet(
    skip?: number,
    limit: number = 50,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/scans/machines',
      query: {
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Project
   * @param id
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteProjectApiV1ScansDelete(
    id: number,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/v1/scans',
      query: {
        'id': id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
