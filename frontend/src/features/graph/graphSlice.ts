import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { type Edge, type Node } from 'reactflow';

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

const initialState: Graph = {
  nodes: [],
  edges: [],
};

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    createNode: (state, action: PayloadAction<Node>) => {
      console.log('addNode reducer in graphSlice', state, action);
      state.nodes.push(action.payload);
    },

    deleteNode: (state, action: PayloadAction<Node>) => {
      state.nodes = state.nodes.filter((n) => {
        console.log('filtering removing');
        n.id !== action.payload.id;
      });
    },

    updateNode: (state, action: PayloadAction<Node>) => {
      state.nodes = state.nodes.filter((n) => {
        console.log('filtering removing');
        n.id !== action.payload.id;
      });
      state.nodes.push(action.payload)
    },
  },
});

export const { createNode, deleteNode, updateNode } = graphSlice.actions;

export const graphNodes = (state: RootState) => state.graph.nodes;

export default graphSlice.reducer;
