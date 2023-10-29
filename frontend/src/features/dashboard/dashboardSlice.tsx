import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/app/store';
import sdk from '@/app/api';
import { Entitiesv1, Graph, GraphCreate } from '@/app/openapi';
import Entities from '../../routes/dashboard/Entities';

export interface Graphs {
  graphs: Graph[];
  favoriteGraphs: Graph[];
  isLoadingGraphs: boolean;
  isGraphsError: boolean;
  isLoadingFavoriteGraphs: boolean;
  isFavoriteGraphsError: boolean;
  isLoadingEntities: boolean;
  isLoadingFavoriteEntities: boolean;
  isEntitiesError: boolean;
  isFavoriteEntitesError: boolean;
  favoriteEntities: JSONObject[];
  entities: JSONObject[];
  activeGraph: null | Graph;
  selectedEntity: null | JSONObject;
  activeTab: "graphs" | "entities" | "market";
  graphsCount: number;
  favoriteGraphsCount: number
  favoriteEntitiesCount: number;
  entitiesCount: number;
  activeEntityId: JSONObject | null;
}

const initialState: Graphs = {
  isLoadingGraphs: false,
  isGraphsError: false,
  favoriteGraphs: [],
  graphs: [],
  graphsCount: 0,
  favoriteGraphsCount: 0,
  activeGraph: null,
  favoriteEntitiesCount: 0,
  entitiesCount: 0,
  selectedEntity: null,
  entities: [],
  favoriteEntities: [],
  isLoadingFavoriteGraphs: false,
  isFavoriteGraphsError: false,
  isLoadingEntities: false,
  isLoadingFavoriteEntities: false,
  isEntitiesError: false,
  isFavoriteEntitesError: false,
  activeTab: "graphs",
  activeEntityId: null
};


interface UpdateGraphFavorite {
  uuid: string
  isFavorite: boolean
}

interface DataFavorite {
  data: Graph
  isFavorite: boolean
}

interface ErrorFavorite {
  data: Graph;
  isFavorite: boolean;
}

// TODO: Fix these stupid fucking types in the builder...
export const updateGraphFavorite = createAsyncThunk("graphs/updateGraphFavorite", async ({ uuid, isFavorite }: UpdateGraphFavorite, thunkAPI): Promise<DataFavorite | ErrorFavorite> => await sdk.graphs.updateFavoriteGraphUuid(uuid, isFavorite)
  .then((data: Graph) => ({ data, isFavorite }))
  .catch((error) => ({ data: error, isFavorite }))
);


export const createGraph = createAsyncThunk("graphs/createGraph", async (createGraph: GraphCreate, thunkAPI) => await sdk.graphs.createGraph(createGraph)
  .then(graph => graph)
  .catch(error => {
    console.error(error);
    return thunkAPI.rejectWithValue(error)
  })
);

export const deleteGraph = createAsyncThunk("graphs/deleteGraph", async (uuid: string, thunkAPI) => await sdk.graphs.deleteGraph(uuid)
  .then(() => uuid)
  .catch((error: Error) => {
    console.error(error);
    return thunkAPI.rejectWithValue(error);
  })
);

interface GetGraphs {
  pageSize: number, pageIndex: number, isFavorite: boolean
}

export const getGraphs = createAsyncThunk("graphs/getGraphs", async ({
  pageSize,
  pageIndex,
  isFavorite }: GetGraphs,
  thunkAPI
) => await sdk.graphs.getGraphs(pageSize * pageIndex, pageSize, isFavorite)
  .then((data) => {
    return { data, isFavorite }
  })
  .catch(error => {
    console.error(error);
    return thunkAPI.rejectWithValue({ error, isFavorite });
  }))


export const getEntities = createAsyncThunk("entities/getEntities", async ({
  pageSize,
  pageIndex,
  isFavorite }: GetGraphs,
  thunkAPI
) => await sdk.entities.getEntities(pageSize * pageIndex, pageSize, isFavorite)
  .then((data) => {
    return { data, isFavorite }
  })
  .catch(error => {
    console.error(error);
    return thunkAPI.rejectWithValue({ error, isFavorite });
  }))


export const dashboard = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setActiveEntityId: (state, action) => {
      state.activeEntityId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGraph.fulfilled, (state, action) => {
        state.graphs.push(action.payload)
      })
      .addCase(deleteGraph.fulfilled, (state, action) => {
        state.graphs = state.graphs.filter((graph) => graph.uuid !== action.payload)
        state.favoriteGraphs = state.favoriteGraphs.filter((graph) => graph.uuid !== action.payload)
      })
      .addCase(getGraphs.fulfilled, (state, action) => {
        if (action.payload.isFavorite) {
          state.favoriteGraphs = action.payload.data?.graphs
          state.favoriteGraphsCount = action.payload?.data.count
        } else {
          state.graphs = action.payload.data.graphs
          state.graphsCount = action.payload.data.count
        }
      })
      .addCase(updateGraphFavorite.fulfilled, (state, action) => {
        if (action.payload.isFavorite) {
          state.graphs = state.graphs.filter((graph) => graph.uuid !== action.payload.data.uuid)
          state.favoriteGraphsCount += 1
          state.graphsCount -= 1
          state.favoriteGraphs.push(action.payload.data)
        } else {
          state.favoriteGraphs = state.favoriteGraphs.filter((graph) => graph.uuid !== action.payload.data.uuid)
          state.graphsCount += 1
          state.favoriteGraphsCount -= 1
          state.graphs.push(action.payload.data)
        }
        state.isLoadingFavoriteGraphs = false
        state.isLoadingGraphs = false
      })
      .addCase(updateGraphFavorite.pending, (state, action) => {
        state.isLoadingFavoriteGraphs = true
        state.isLoadingGraphs = true
      })

      .addCase(updateGraphFavorite.rejected, (state, action: JSONObject) => {
        if (action.payload.isFavorite) {
          state.isFavoriteGraphsError = true
          state.isLoadingFavoriteGraphs = false
        }
        if (!action.payload.isFavorite) {
          state.isGraphsError = true
          state.isLoadingGraphs = false
        }
      })
      .addCase(getEntities.fulfilled, (state, action) => {
        if (action.payload.isFavorite) {
          state.favoriteEntities = action.payload.data.entities
          state.favoriteEntitiesCount = action.payload.data.count
        } else {
          state.entities = action.payload.data.entities
          state.entitiesCount = action.payload.data.count
        }
      })
  }
});



export const { setActiveTab, setActiveEntityId } = dashboard.actions;

export const selectDashboardGraphs = (state: RootState) => ({
  graphs: state.dashboard.graphs,
  graphsCount: state.dashboard.graphsCount,
  activeGraph: state.dashboard.activeGraph,
  isLoadingGraphs: state.dashboard.isLoadingGraphs,
  isLoadingFavoriteGraphs: state.dashboard.isLoadingFavoriteGraphs,
  isGraphsError: state.dashboard.isGraphsError,
  isFavoriteGraphsError: state.dashboard.isFavoriteGraphsError,
  favoriteGraphs: state.dashboard.favoriteGraphs,
})
export const selectDashboardEntities = (state: RootState) => ({
  entities: state.dashboard.entities,
  favoriteEntities: state.dashboard.favoriteEntities,
  entitiesCount: state.dashboard.entitiesCount,
  favoriteEntitiesCount: state.dashboard.favoriteEntitiesCount,
  isLoadingEntities: state.dashboard.isLoadingEntities,
  isLoadingFavoriteEntities: state.dashboard.isLoadingFavoriteEntities,
  isEntitiesError: state.dashboard.isEntitiesError,
  isFavoriteEntitiesError: state.dashboard.isFavoriteEntitesError
});
export const selectActiveTab = (state: RootState) => state.dashboard.activeTab
export const selectActiveEntity = (state: RootState) => state.dashboard.entities.filter((entity) => entity.uuid === state.dashboard.activeEntityId)[0]

export default dashboard.reducer;
