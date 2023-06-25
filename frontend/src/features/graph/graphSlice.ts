import { AnyAction, createAsyncThunk, createSelector, createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '@/app/store';
import { XYPosition, type Edge, type Node, applyNodeChanges, NodeChange, updateEdge, Connection } from 'reactflow';
import { nodesService } from '@/services';

export interface EditState {
    editId: string;
  editLabel: string;
  editValue: string;
}

export interface Graph extends EditState {
  nodes: Node[];
  edges: Edge[];
}

const initialState: Graph = {
  nodes: [],
  edges: [],
  editId: '',
  editLabel: '',
  editValue: '',
};

export const fetchNodeBlueprint = createAsyncThunk(
  'graph/saveNewNode',
  async ({ label, position }: { label: string; position: XYPosition }) => {
    const data = await nodesService
      .createNode({
        label,
        position,
      })
      .catch((error) => error.message);
    return data;
  }
);

console.log(fetchNodeBlueprint);

interface UpdateEdgeEvent {
  oldEdge: Edge;
  newConnection: Connection;
}

interface EditValue {
  label: string;
  value: string;
}

export const graph = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setEditLabel: (state, action: PayloadAction<string>) => {
      console.log('setting edit label', action.payload)
      state.editLabel = action.payload;
    },

    setEditId: (state, action: PayloadAction<string>) => {
      console.log('setting edit id', action.payload)
      state.editId = action.payload;
    },

    setEditState: (state, action: PayloadAction<EditState>) => {
      state.editId = action.payload.editId
      state.editLabel = action.payload.editLabel
    },

    saveUserEdits: (state, action) => {
      const nodeToUpdate = state.nodes.find((n) => n.id === state.editId);
      console.log('saving user edits', current(state), action.payload)
      if (nodeToUpdate) {
        nodeToUpdate.data.elements.forEach((element: JSONObject, idx: number) => {
          if (element.label === state.editLabel) {
            element.value = action.payload;
          }
        });
      }
    },

    onEdgeConnect: (state, action) => {
      // @todo
    },

    createEdge: (state, action) => {
      state.edges.push(action.payload);
    },

    setEditValue: (state, action: PayloadAction<EditValue>) => {
      console.log('setting edit value', action.payload)
      state.editValue = action.payload.value;
    },

    createNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },

    deleteNode: (state, action: PayloadAction<Node['id']>) => {
      state.nodes = state.nodes.filter((n) => n.id !== action.payload);
    },

    updateNodeFlow: (state, action: PayloadAction<NodeChange[]>) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },

    updateNodeData: (state, action: PayloadAction<Node>) => {
      const nodeToUpdate = state.nodes.find((n) => n.id === action.payload.id);
      if (nodeToUpdate) {
        nodeToUpdate.data.elements.forEach((element: JSONObject, idx: number) => {
          Object.keys(action.payload.data).some((updateKey: string) => {
            if (element.label === updateKey) {
              element.value = action.payload.data[updateKey];
              return element;
            }
          });
        });
      }
    },

    setNodeSelected: (state, action: PayloadAction<{ id: string, selected: boolean }>) => {
      const nodeToUpdate = state.nodes.find((n) => n.id === action.payload.id);
      if (nodeToUpdate) {
        nodeToUpdate.selected = action.payload.selected
      }
      console.log(current(nodeToUpdate))
    },

    updateNode: (state, action: PayloadAction<Node>) => {
      const editIdx = state.nodes.findIndex((n) => n.id === action.payload.id);
      state.nodes[editIdx] = action.payload;
    },

    updateEdgeEvent: (state, action: PayloadAction<UpdateEdgeEvent>) => {
      state.edges = updateEdge(action.payload.oldEdge, action.payload.newConnection, state.edges);
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNodeBlueprint.fulfilled, (state, action) => {
      state.nodes.push(action.payload);
    });
  },
});

// Export action creators, reducers, and selectors
export const {
  createEdge,
  createNode,
  deleteNode,
  updateNodeFlow,
  updateNode,
  updateEdgeEvent,
  updateNodeData,
  setEditLabel,
  setEditValue,
  saveUserEdits,
  setEditId,
  onEdgeConnect,
  setEditState,
  setNodeSelected
} = graph.actions;

export const graphNodes = (state: RootState) => state.graph.nodes;
export const graphEdges = (state: RootState) => state.graph.nodes;
export const selectNodeValue = (state: RootState, id: string, label: string) => {
  const node = state.graph.nodes.find((node: any) => {
    return node.id === id;
  });
  if (node) return node.data.elements.find((elm: any) => elm.label === label).value;
  return '';
};

export const selectEditLabel = (state: RootState) => state.graph.editLabel;
export const selectEditId = (state: RootState) => state.graph.editId;
export const selectEditValue = (state: RootState) => state.graph.editValue;

export const selectEditState = createSelector([selectEditId, selectEditLabel], (id, label) => ({
  id,
  label,
}));

export default graph.reducer;
