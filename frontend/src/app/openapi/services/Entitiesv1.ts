/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityBase } from '../models/EntityBase';
import type { PostEntityCreate } from '../models/PostEntityCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Entitiesv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Entity
   * @param entityUuid
   * @returns any Successful Response
   * @throws ApiError
   */
  public getEntity(
    entityUuid: string,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/entities/{entity_uuid}',
      path: {
        'entity_uuid': entityUuid,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Entity
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public createEntity(
    requestBody: PostEntityCreate,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/entities',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Entities
   * @param skip
   * @param limit
   * @param isFavorite
   * @returns any Successful Response
   * @throws ApiError
   */
  public getEntities(
    skip?: number,
    limit: number = 100,
    isFavorite: boolean = false,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/entities',
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
   * Update Entity By Uuid
   * @param entityId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public updateEntityByUuid(
    entityId: string,
    requestBody: EntityBase,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/v1/entities/{entity_id}',
      path: {
        'entity_id': entityId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Entity
   * @param entityId
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteEntity(
    entityId: string,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/v1/entities/{entity_id}',
      path: {
        'entity_id': entityId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Favorite Entity Uuid
   * @param entityId
   * @param isFavorite
   * @returns any Successful Response
   * @throws ApiError
   */
  public updateFavoriteEntityUuid(
    entityId: string,
    isFavorite: boolean = false,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/v1/entities/{entity_id}/favorite',
      path: {
        'entity_id': entityId,
      },
      query: {
        'is_favorite': isFavorite,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
