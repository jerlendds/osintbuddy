/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { Entitiesv1 } from './services/Entitiesv1';
import { Graphsv1 } from './services/Graphsv1';
import { Loginv1 } from './services/Loginv1';
import { Nodesv1 } from './services/Nodesv1';
import { Scansv1 } from './services/Scansv1';
import { Usersv1 } from './services/Usersv1';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class obSDK {

  public readonly entities: Entitiesv1;
  public readonly graphs: Graphsv1;
  public readonly login: Loginv1;
  public readonly nodes: Nodesv1;
  public readonly scans: Scansv1;
  public readonly users: Usersv1;

  public readonly request: BaseHttpRequest;

  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? '',
      VERSION: config?.VERSION ?? '/api/v1',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });

    this.entities = new Entitiesv1(this.request);
    this.graphs = new Graphsv1(this.request);
    this.login = new Loginv1(this.request);
    this.nodes = new Nodesv1(this.request);
    this.scans = new Scansv1(this.request);
    this.users = new Usersv1(this.request);
  }
}

