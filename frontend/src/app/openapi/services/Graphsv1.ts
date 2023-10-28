/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Graph } from '../models/Graph';
import type { GraphCreate } from '../models/GraphCreate';
import type { GraphsList } from '../models/GraphsList';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Graphsv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Graph
   * @param graphId
   * @returns Graph Successful Response
   * @throws ApiError
   */
  public getGraph(
    graphId: string,
  ): CancelablePromise<Graph> {
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
   * Update Favorite Graph Uuid
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
   * Get Graphs
   * @param skip
   * @param limit
   * @param isFavorite
   * @returns GraphsList Successful Response
   * @throws ApiError
   */
  public getGraphs(
    skip?: number,
    limit: number = 100,
    isFavorite: boolean = false,
  ): CancelablePromise<GraphsList> {
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
   * Create Graph
   * @param requestBody
   * @returns Graph Successful Response
   * @throws ApiError
   */
  public createGraph(
    requestBody: GraphCreate,
  ): CancelablePromise<Graph> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/graphs',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Graph
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
   * Get Graph Stats
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
