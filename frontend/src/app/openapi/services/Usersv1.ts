/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_user_open } from '../models/Body_create_user_open';
import type { Body_update_user_me } from '../models/Body_update_user_me';
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';
import type { UserUpdate } from '../models/UserUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Usersv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Read Users
   * Retrieve users.
   * @param skip
   * @param limit
   * @returns User Successful Response
   * @throws ApiError
   */
  public getUsers(
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<User>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/users/',
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
   * Create User
   * Create new user.
   * @param requestBody
   * @returns User Successful Response
   * @throws ApiError
   */
  public createUser(
    requestBody: UserCreate,
  ): CancelablePromise<User> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/users/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read User Me
   * Get current user.
   * @returns User Successful Response
   * @throws ApiError
   */
  public readUser(): CancelablePromise<User> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/users/me',
    });
  }

  /**
   * Update User Me
   * Update own user.
   * @param requestBody
   * @returns User Successful Response
   * @throws ApiError
   */
  public updateUserMe(
    requestBody?: Body_update_user_me,
  ): CancelablePromise<User> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/v1/users/me',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create User Open
   * Create new user without the need to be logged in.
   * @param requestBody
   * @returns User Successful Response
   * @throws ApiError
   */
  public createUserOpen(
    requestBody: Body_create_user_open,
  ): CancelablePromise<User> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/users/open',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read User By Id
   * Get a specific user by id.
   * @param userId
   * @returns User Successful Response
   * @throws ApiError
   */
  public readUserById(
    userId: number,
  ): CancelablePromise<User> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/users/{user_id}',
      path: {
        'user_id': userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update User
   * Update a user.
   * @param userId
   * @param requestBody
   * @returns User Successful Response
   * @throws ApiError
   */
  public updateUser(
    userId: number,
    requestBody: UserUpdate,
  ): CancelablePromise<User> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/v1/users/{user_id}',
      path: {
        'user_id': userId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
