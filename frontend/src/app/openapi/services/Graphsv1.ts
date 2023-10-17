/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Graphsv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Project
   * @param graphId
   * @returns any Successful Response
   * @throws ApiError
   */
  public getGraph(
    graphId: string,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/graphs/{graph_id}',
      path: {
        'graph_id': graphId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Project
   * @param graphId
   * @param isFavorite
   * @returns any Successful Response
   * @throws ApiError
   */
  public updateFavoriteGraphUuid(
    graphId: string,
    isFavorite: boolean = false,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/v1/graphs/{graph_id}/favorite',
      path: {
        'graph_id': graphId,
      },
      query: {
        'is_favorite': isFavorite,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Project
   * @param skip
   * @param limit
   * @param isFavorite
   * @returns any Successful Response
   * @throws ApiError
   */
  public getGraphs(
    skip?: number,
    limit: number = 100,
    isFavorite: boolean = false,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/graphs',
      query: {
        'skip': skip,
        'limit': limit,
        'is_favorite': isFavorite,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Project
   * @param name
   * @param description
   * @returns any Successful Response
   * @throws ApiError
   */
  public createGraph(
    name: string,
    description: string = '',
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/graphs',
      query: {
        'name': name,
        'description': description,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Project
   * @param uuid
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteGraph(
    uuid: string,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/v1/graphs',
      query: {
        'uuid': uuid,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Unique Graph Labels
   * @param graphId
   * @returns any Successful Response
   * @throws ApiError
   */
  public getGraphStats(
    graphId: string,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/graphs/{graph_id}/stats',
      path: {
        'graph_id': graphId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
