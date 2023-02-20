export interface NodeContextProps {
  node: any;
  reactFlowInstance: any;
  getId: Function;
  addNode: Function;
  addEdge: Function;
  nodeData: Array<any>;
  nodeType: string;
  parentId: string;
}

export type NodeId = `${string | ''}n_${number}`;

export interface Welcome {
  results: Result[];
  total: number;
  took: number;
  has_more: boolean;
}

export interface Result {
  task: Task;
  stats: Stats;
  page: Page;
  _id: string;
  sort: Array<number | string>;
  result: string;
  screenshot: string;
}

export interface Page {
  country?: string;
  server?: string;
  redirected?: Redirected;
  ip: string;
  mimeType: MIMEType;
  title?: string;
  url: string;
  tlsValidDays?: number;
  tlsAgeDays?: number;
  tlsValidFrom?: Date;
  domain: string;
  apexDomain: string;
  asnname: string;
  asn: string;
  tlsIssuer?: string;
  status: string;
  umbrellaRank?: number;
  ptr?: string;
}

export enum MIMEType {
  TextHTML = 'text/html',
}

export enum Redirected {
  HTTPSOnly = 'https-only',
  OffDomain = 'off-domain',
  SameDomain = 'same-domain',
  SubDomain = 'sub-domain',
}

export interface Stats {
  uniqIPs: number;
  uniqCountries: number;
  dataLength: number;
  encodedDataLength: number;
  requests: number;
}

export interface Task {
  visibility: Visibility;
  method: Method;
  domain: string;
  apexDomain: string;
  time: Date;
  source?: Source;
  uuid: string;
  url: string;
  tags?: string[];
}

export enum Method {
  API = 'api',
  Automatic = 'automatic',
  Manual = 'manual',
}

export enum Source {
  CertstreamSuspicious = 'certstream-suspicious',
}

export enum Visibility {
  Public = 'public',
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toWelcome(json: string): Welcome {
    return cast(JSON.parse(json), r('Welcome'));
  }

  public static welcomeToJson(value: Welcome): string {
    return JSON.stringify(uncast(value, r('Welcome')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(', ')}]`;
    }
  } else if (typeof typ === 'object' && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l('Date'), val, key, parent);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue(l(ref || 'object'), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === 'object' && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Welcome: o(
    [
      { json: 'results', js: 'results', typ: a(r('Result')) },
      { json: 'total', js: 'total', typ: 0 },
      { json: 'took', js: 'took', typ: 0 },
      { json: 'has_more', js: 'has_more', typ: true },
    ],
    false
  ),
  Result: o(
    [
      { json: 'task', js: 'task', typ: r('Task') },
      { json: 'stats', js: 'stats', typ: r('Stats') },
      { json: 'page', js: 'page', typ: r('Page') },
      { json: '_id', js: '_id', typ: '' },
      { json: 'sort', js: 'sort', typ: a(u(0, '')) },
      { json: 'result', js: 'result', typ: '' },
      { json: 'screenshot', js: 'screenshot', typ: '' },
    ],
    false
  ),
  Page: o(
    [
      { json: 'country', js: 'country', typ: u(undefined, '') },
      { json: 'server', js: 'server', typ: u(undefined, '') },
      { json: 'redirected', js: 'redirected', typ: u(undefined, r('Redirected')) },
      { json: 'ip', js: 'ip', typ: '' },
      { json: 'mimeType', js: 'mimeType', typ: r('MIMEType') },
      { json: 'title', js: 'title', typ: u(undefined, '') },
      { json: 'url', js: 'url', typ: '' },
      { json: 'tlsValidDays', js: 'tlsValidDays', typ: u(undefined, 0) },
      { json: 'tlsAgeDays', js: 'tlsAgeDays', typ: u(undefined, 0) },
      { json: 'tlsValidFrom', js: 'tlsValidFrom', typ: u(undefined, Date) },
      { json: 'domain', js: 'domain', typ: '' },
      { json: 'apexDomain', js: 'apexDomain', typ: '' },
      { json: 'asnname', js: 'asnname', typ: '' },
      { json: 'asn', js: 'asn', typ: '' },
      { json: 'tlsIssuer', js: 'tlsIssuer', typ: u(undefined, '') },
      { json: 'status', js: 'status', typ: '' },
      { json: 'umbrellaRank', js: 'umbrellaRank', typ: u(undefined, 0) },
      { json: 'ptr', js: 'ptr', typ: u(undefined, '') },
    ],
    false
  ),
  Stats: o(
    [
      { json: 'uniqIPs', js: 'uniqIPs', typ: 0 },
      { json: 'uniqCountries', js: 'uniqCountries', typ: 0 },
      { json: 'dataLength', js: 'dataLength', typ: 0 },
      { json: 'encodedDataLength', js: 'encodedDataLength', typ: 0 },
      { json: 'requests', js: 'requests', typ: 0 },
    ],
    false
  ),
  Task: o(
    [
      { json: 'visibility', js: 'visibility', typ: r('Visibility') },
      { json: 'method', js: 'method', typ: r('Method') },
      { json: 'domain', js: 'domain', typ: '' },
      { json: 'apexDomain', js: 'apexDomain', typ: '' },
      { json: 'time', js: 'time', typ: Date },
      { json: 'source', js: 'source', typ: u(undefined, r('Source')) },
      { json: 'uuid', js: 'uuid', typ: '' },
      { json: 'url', js: 'url', typ: '' },
      { json: 'tags', js: 'tags', typ: u(undefined, a('')) },
    ],
    false
  ),
  MIMEType: ['text/html'],
  Redirected: ['https-only', 'off-domain', 'same-domain', 'sub-domain'],
  Method: ['api', 'automatic', 'manual'],
  Source: ['certstream-suspicious'],
  Visibility: ['public'],
};

export interface CSEResponse {
    context:          Context;
    cursor:           Cursor;
    findMoreOnGoogle: FindMoreOnGoogle;
    results:          Result[];
}

export interface Context {
    facets:        Facet[];
    title:         string;
    total_results: string;
}

export interface Facet {
    anchor:        string;
    count:         string;
    label:         string;
    label_with_op: string;
}

export interface Cursor {
    currentPageIndex:     number;
    estimatedResultCount: string;
    moreResultsUrl:       string;
    pages:                Page[];
    resultCount:          string;
    searchResultTime:     string;
}

export interface Page {
    label: number;
    start: string;
}

export interface FindMoreOnGoogle {
    url: string;
}

export interface Result {
    breadcrumbUrl:       BreadcrumbURL;
    cacheUrl:            string;
    clicktrackUrl:       string;
    content:             string;
    contentNoFormatting: string;
    formattedUrl:        string;
    richSnippet:         RichSnippet;
    title:               string;
    titleNoFormatting:   string;
    unescapedUrl:        string;
    url:                 string;
    visibleUrl:          string;
}

export interface BreadcrumbURL {
    crumbs: string[];
    host:   string;
}

export interface RichSnippet {
    cseImage?:     CSEImage;
    cseThumbnail?: CSEThumbnail;
    metatags:      { [key: string]: string };
    blogposting?:  Blogposting;
    person?:       Person;
}

export interface Blogposting {
    articlebody: string;
    blogid:      string;
    imageUrl:    string;
    name:        string;
    postid:      string;
}

export interface CSEImage {
    src: string;
}

export interface CSEThumbnail {
    height: string;
    src:    string;
    width:  string;
}

export interface Person {
    name: string;
}
