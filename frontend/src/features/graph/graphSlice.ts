import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { XYPosition, type Edge, type Node, applyNodeChanges, NodeChange, updateEdge } from 'reactflow';
import { nodesService } from '@/services';

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

const initialState: Graph = {
  nodes: [],
  edges: [],
};

// @todo clean up the backend response
export const saveNewNode = createAsyncThunk(
  'graph/saveNewNode',
  async ({ label, position }: { label: string; position: XYPosition }) => {
    console.log('wtf', label, position);
    const data = await nodesService
      .createNode({
        label,
        position,
      })
      .catch((_) => _.message);
    data.id = data.id.toString();
    data['position'] = {
      x: data.x,
      y: data.y,
    };
    const copy = { ...data };
    delete data.elements;
    delete data.style;
    delete data.color;
    delete data.icon;
    delete data.label;

    delete copy.id;
    delete copy.position;
    delete copy.x;
    delete copy.y;
    data['data'] = copy;
    data['type'] = 'base';
    delete data.x;
    delete data.y;
    return data;
  }
);

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    createNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },

    deleteNode: (state, action: PayloadAction<Node['id']>) => {
      state.nodes = state.nodes.filter((n) => {
        n.id !== action.payload;
      });
    },

    updateNodeFlow: (state, action: PayloadAction<NodeChange[]>) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },

    updateNode: (state, action) => {
      state.nodes = state.nodes.filter((n) => {
        n.id !== action.payload.id;
      });
      state.nodes.push(action.payload);
    },

    updateEdgeEvent: (state, action) => {
        state.edges = updateEdge(action.payload.oldEdge, action.payload.newConnection, state.edges)
    }
  },
  extraReducers(builder) {
    builder.addCase(saveNewNode.fulfilled, (state, action) => {
      console.log('pushing payload', action);
      state.nodes.push(action.payload);
    });
  },
});

export const { createNode, deleteNode, updateNodeFlow, updateNode, updateEdgeEvent } = graphSlice.actions;

export const graphNodes = (state: RootState) => state.graph.nodes;
export const graphEdges = (state: RootState) => state.graph.nodes;

export default graphSlice.reducer;
