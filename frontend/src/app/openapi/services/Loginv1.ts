/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_login_access_token } from '../models/Body_login_access_token';
import type { Body_reset_password } from '../models/Body_reset_password';
import type { Msg } from '../models/Msg';
import type { Token } from '../models/Token';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class Loginv1 {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Login Access Token
   * @param formData
   * @returns Token Successful Response
   * @throws ApiError
   */
  public loginAccessToken(
    formData: Body_login_access_token,
  ): CancelablePromise<Token> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/login/access-token',
      formData: formData,
      mediaType: 'application/x-www-form-urlencoded',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Recover Password
   * Password Recovery
   * @param email
   * @returns Msg Successful Response
   * @throws ApiError
   */
  public passwordRecoveryEmail(
    email: string,
  ): CancelablePromise<Msg> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/password-recovery/{email}',
      path: {
        'email': email,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Reset Password
   * Reset password
   * @param requestBody
   * @returns Msg Successful Response
   * @throws ApiError
   */
  public resetPassword(
    requestBody: Body_reset_password,
  ): CancelablePromise<Msg> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/reset-password/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
