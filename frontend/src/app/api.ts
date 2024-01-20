import { emptyApi as api } from "./baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    refreshEntityPlugins: build.query<
      RefreshEntityPluginsApiResponse,
      RefreshEntityPluginsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/node/refresh`,
        params: { hid: queryArg.hid },
      }),
    }),
    createEntityOnDrop: build.mutation<
      CreateEntityOnDropApiResponse,
      CreateEntityOnDropApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/node/`,
        method: "POST",
        body: queryArg.createNode,
        params: { hid: queryArg.hid },
      }),
    }),
    getCasdoorConfig: build.query<
      GetCasdoorConfigApiResponse,
      GetCasdoorConfigApiArg
    >({
      query: () => ({ url: `/api/v1/config/casdoor` }),
    }),
    postSignin: build.mutation<PostSigninApiResponse, PostSigninApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/auth/sign-in`,
        method: "POST",
        params: { code: queryArg.code },
      }),
    }),
    postSignout: build.mutation<PostSignoutApiResponse, PostSignoutApiArg>({
      query: () => ({ url: `/api/v1/auth/sign-out`, method: "POST" }),
    }),
    getAccount: build.query<GetAccountApiResponse, GetAccountApiArg>({
      query: () => ({ url: `/api/v1/account/` }),
    }),
    getGraph: build.query<GetGraphApiResponse, GetGraphApiArg>({
      query: (queryArg) => ({ url: `/api/v1/graph/${queryArg.hid}` }),
    }),
    updateGraphFavoriteId: build.mutation<
      UpdateGraphFavoriteIdApiResponse,
      UpdateGraphFavoriteIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/graph/${queryArg.hid}/favorite/`,
        method: "PATCH",
      }),
    }),
    getGraphs: build.query<GetGraphsApiResponse, GetGraphsApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/graph`,
        params: {
          skip: queryArg.skip,
          limit: queryArg.limit,
          favorite_skip: queryArg.favoriteSkip,
          favorite_limit: queryArg.favoriteLimit,
        },
      }),
    }),
    createGraph: build.mutation<CreateGraphApiResponse, CreateGraphApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/graph`,
        method: "POST",
        body: queryArg.graphCreate,
      }),
    }),
    deleteGraph: build.mutation<DeleteGraphApiResponse, DeleteGraphApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/graph`,
        method: "DELETE",
        params: { hid: queryArg.hid },
      }),
    }),
    getGraphsByFavorite: build.query<
      GetGraphsByFavoriteApiResponse,
      GetGraphsByFavoriteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/graph/favorites`,
        params: {
          skip: queryArg.skip,
          limit: queryArg.limit,
          is_favorite: queryArg.isFavorite,
        },
      }),
    }),
    getGraphStats: build.query<GetGraphStatsApiResponse, GetGraphStatsApiArg>({
      query: (queryArg) => ({ url: `/api/v1/graph/${queryArg.hid}/stats` }),
    }),
    getEntityTransforms: build.query<
      GetEntityTransformsApiResponse,
      GetEntityTransformsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/entity/plugins/transform/`,
        params: { label: queryArg.label },
      }),
    }),
    getEntity: build.query<GetEntityApiResponse, GetEntityApiArg>({
      query: (queryArg) => ({ url: `/api/v1/entity/details/${queryArg.hid}` }),
    }),
    getEntities: build.query<GetEntitiesApiResponse, GetEntitiesApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/entity`,
        params: { skip: queryArg.skip, limit: queryArg.limit },
      }),
    }),
    createEntity: build.mutation<CreateEntityApiResponse, CreateEntityApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/entity`,
        method: "POST",
        body: queryArg.postEntityCreate,
      }),
    }),
    updateEntityById: build.mutation<
      UpdateEntityByIdApiResponse,
      UpdateEntityByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/entity/${queryArg.hid}`,
        method: "PUT",
        body: queryArg.entityUpdate,
      }),
    }),
    deleteEntity: build.mutation<DeleteEntityApiResponse, DeleteEntityApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/entity/${queryArg.hid}`,
        method: "DELETE",
      }),
    }),
    updateEntityFavoriteId: build.mutation<
      UpdateEntityFavoriteIdApiResponse,
      UpdateEntityFavoriteIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/entity/${queryArg.hid}/favorite`,
        method: "PUT",
      }),
    }),
    createScanMachine: build.mutation<
      CreateScanMachineApiResponse,
      CreateScanMachineApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/scan/machines`,
        method: "POST",
        body: queryArg.scanMachineCreate,
      }),
    }),
    getScanMachines: build.query<
      GetScanMachinesApiResponse,
      GetScanMachinesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/scan/machines`,
        params: { skip: queryArg.skip, limit: queryArg.limit },
      }),
    }),
    deleteScanProject: build.mutation<
      DeleteScanProjectApiResponse,
      DeleteScanProjectApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/scan`,
        method: "DELETE",
        params: { sid: queryArg.sid },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type RefreshEntityPluginsApiResponse =
  /** status 200 Successful Response */ any;
export type RefreshEntityPluginsApiArg = {
  hid: string;
};
export type CreateEntityOnDropApiResponse =
  /** status 200 Successful Response */ any;
export type CreateEntityOnDropApiArg = {
  hid: string;
  createNode: CreateNode;
};
export type GetCasdoorConfigApiResponse =
  /** status 200 Successful Response */ any;
export type GetCasdoorConfigApiArg = void;
export type PostSigninApiResponse = /** status 200 Successful Response */
  | Status
  | HttpError;
export type PostSigninApiArg = {
  code: string;
};
export type PostSignoutApiResponse =
  /** status 200 Successful Response */ Status;
export type PostSignoutApiArg = void;
export type GetAccountApiResponse = /** status 200 Successful Response */
  | UserInDbBase
  | HttpError;
export type GetAccountApiArg = void;
export type GetGraphApiResponse = /** status 200 Successful Response */ Graph;
export type GetGraphApiArg = {
  hid: string;
};
export type UpdateGraphFavoriteIdApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateGraphFavoriteIdApiArg = {
  hid: string;
};
export type GetGraphsApiResponse =
  /** status 200 Successful Response */ AllGraphsList;
export type GetGraphsApiArg = {
  skip?: number;
  limit?: number;
  favoriteSkip?: number;
  favoriteLimit?: number;
};
export type CreateGraphApiResponse =
  /** status 200 Successful Response */ Graph;
export type CreateGraphApiArg = {
  graphCreate: GraphCreate;
};
export type DeleteGraphApiResponse = /** status 200 Successful Response */ any;
export type DeleteGraphApiArg = {
  hid: string;
};
export type GetGraphsByFavoriteApiResponse =
  /** status 200 Successful Response */ GraphsList;
export type GetGraphsByFavoriteApiArg = {
  skip?: number;
  limit?: number;
  isFavorite?: boolean;
};
export type GetGraphStatsApiResponse =
  /** status 200 Successful Response */ any;
export type GetGraphStatsApiArg = {
  hid: string;
};
export type GetEntityTransformsApiResponse =
  /** status 200 Successful Response */ any;
export type GetEntityTransformsApiArg = {
  label: string;
};
export type GetEntityApiResponse = /** status 200 Successful Response */ Entity;
export type GetEntityApiArg = {
  hid: string;
};
export type GetEntitiesApiResponse =
  /** status 200 Successful Response */ AllEntitiesList;
export type GetEntitiesApiArg = {
  skip?: number;
  limit?: number;
};
export type CreateEntityApiResponse = /** status 200 Successful Response */ any;
export type CreateEntityApiArg = {
  postEntityCreate: PostEntityCreate;
};
export type UpdateEntityByIdApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateEntityByIdApiArg = {
  hid: string;
  entityUpdate: EntityUpdate;
};
export type DeleteEntityApiResponse = /** status 200 Successful Response */ any;
export type DeleteEntityApiArg = {
  hid: string;
};
export type UpdateEntityFavoriteIdApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateEntityFavoriteIdApiArg = {
  hid: string;
};
export type CreateScanMachineApiResponse =
  /** status 200 Successful Response */ any;
export type CreateScanMachineApiArg = {
  scanMachineCreate: ScanMachineCreate;
};
export type GetScanMachinesApiResponse =
  /** status 200 Successful Response */ any;
export type GetScanMachinesApiArg = {
  skip?: number;
  limit?: number;
};
export type DeleteScanProjectApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteScanProjectApiArg = {
  sid: number;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type XyPosition = {
  x: number;
  y: number;
};
export type CreateNode = {
  label: string;
  position: XyPosition;
};
export type Status = {
  status: string;
};
export type HttpError = {
  detail: string;
};
export type UserInDbBase = {
  name: string;
  username?: string | null;
  email?: string | null;
  avatar?: string | null;
  phone?: string | null;
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  is_admin: boolean;
  created_time: string;
  updated_time: string;
  cid: string;
};
export type Graph = {
  label: string;
  description: string | null;
  is_favorite?: boolean;
  id: string;
  updated: string;
  created: string;
  last_seen: string;
};
export type AllGraphsList = {
  graphs: Graph[];
  count: number;
  favorite_graphs: Graph[];
  favorite_count: number;
};
export type GraphCreate = {
  label: string;
  description: string | null;
  is_favorite?: boolean;
};
export type GraphsList = {
  graphs: Graph[];
  count: number;
};
export type Entity = {
  label?: string;
  author?: string;
  description?: string;
  source?: string;
  is_favorite?: boolean;
  id: string;
  last_edited: string;
  updated: string;
  created: string;
};
export type EntityInList = {
  label: string;
  author: string;
  description: string;
  id: string;
  last_edited: string;
  is_favorite: boolean;
};
export type AllEntitiesList = {
  entities: EntityInList[];
  count: number;
  favorite_entities: EntityInList[];
  favorite_count: number;
};
export type PostEntityCreate = {
  label: string;
  author: string;
  description: string;
};
export type EntityUpdate = {
  label?: string | null;
  author?: string | null;
  description?: string | null;
  source: string | null;
  is_favorite?: boolean;
};
export type ScanMachineCreate = {
  name: string;
  description: string;
};
export const {
  useRefreshEntityPluginsQuery,
  useCreateEntityOnDropMutation,
  useGetCasdoorConfigQuery,
  usePostSigninMutation,
  usePostSignoutMutation,
  useGetAccountQuery,
  useGetGraphQuery,
  useUpdateGraphFavoriteIdMutation,
  useGetGraphsQuery,
  useCreateGraphMutation,
  useDeleteGraphMutation,
  useGetGraphsByFavoriteQuery,
  useGetGraphStatsQuery,
  useGetEntityTransformsQuery,
  useGetEntityQuery,
  useGetEntitiesQuery,
  useCreateEntityMutation,
  useUpdateEntityByIdMutation,
  useDeleteEntityMutation,
  useUpdateEntityFavoriteIdMutation,
  useCreateScanMachineMutation,
  useGetScanMachinesQuery,
  useDeleteScanProjectMutation,
} = injectedRtkApi;
