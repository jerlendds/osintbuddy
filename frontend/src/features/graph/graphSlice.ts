import { AnyAction, createAsyncThunk, createSelector, createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '@/app/store';
import {
  XYPosition,
  type Edge,
  type Node,
  applyNodeChanges,
  NodeChange,
  updateEdge,
  Connection,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import { nodesService } from '@/services';

export interface Graph extends EditState {
  nodes: Node[];
  edges: Edge[];
  project: ActiveProject;
}

const initialState: Graph = {
  nodes: [],
  edges: [],
  editId: '',
  editLabel: '',
  editValue: '',
  project: {
    description: '',
    id: -1,
    uuid: '',
    name: '',
  },
};

export const fetchNodeBlueprint = createAsyncThunk(
  'graph/saveNewNode',
  async ({ label, position, uuid }: { label: string; position: XYPosition; uuid: string }) => {
    const data = await nodesService
      .createNode({
        label,
        position,
        uuid,
      })
      .catch((error) => error.message);
    return data;
  }
);

export const saveNode = createAsyncThunk(
  'graph/saveNode',
  async ({ id, data, position }: { id: string; position: XYPosition; data: JSONObject }) => {
    return { id, data, position, type: 'base' };
  }
);

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
    setActiveProject: (state, action: PayloadAction<ActiveProjectGraph>) => {
      state.project.uuid = action.payload.uuid;
      state.project.name = action.payload.name;
      state.project.id = action.payload.id;
      state.project.description = action.payload?.description ?? '';

    },

    setEditLabel: (state, action: PayloadAction<string>) => {
      console.log('setting edit label', action.payload);
      state.editLabel = action.payload;
    },

    setEditId: (state, action: PayloadAction<string>) => {
      console.log('setting edit id', action.payload);
      state.editId = action.payload;
    },

    setEditState: (state, action: PayloadAction<EditState>) => {
      state.editId = action.payload.editId;
      state.editLabel = action.payload.editLabel;
    },

    saveUserEdits: (state, action) => {
      const { value, nodeId, label } = action.payload;
      const nodeToUpdate = state.nodes.find((n) => n.id === nodeId);
      if (nodeToUpdate)
        nodeToUpdate.data.elements.forEach((element: JSONObject) => {
          if (Array.isArray(element)) {
            element.forEach((elm: JSONObject) => {
              if (elm.label === label) {
                console.log('saving?! elm', label, elm, value);
                elm.value = value;
              }
            });
          } else {
            if (element.label === label) {
              console.log('saving?! element', label, element, value);
              element.value = value;
            }
          }
        });
    },

    onEdgesChange: (state, action) => {
      console.log('onEdgesChange?!', current(state.edges), action.payload);
      state.edges = [action.payload, ...state.edges];

      console.log('onEdgesChange?!', current(state.edges));
      // state.edges = applyEdgeChanges(action.payload, state.edges)
    },

    onEdgeUpdate: (state, action) => {
      state.edges = updateEdge(action.payload.oldEdge, action.payload.newConnection, state.edges);
    },

    createEdge: (state, action) => {
      state.edges = addEdge(action.payload, state.edges);
    },

    setEditValue: (state, action: PayloadAction<EditValue>) => {
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

    resetGraph: (state) => {
      state.nodes = []
      state.edges = []
    },
    
    updateNodeData: (state, action: PayloadAction<Node>) => {
      const nodeToUpdate = state.nodes.find((n) => n.id === action.payload.id);
      if (nodeToUpdate) {
        nodeToUpdate.data.elements.forEach((element: JSONObject, idx: number) => {
          if (Array.isArray(element)) {
            element.forEach((elm: JSONObject) => {
              Object.keys(action.payload.data).some((updateKey: string) => {
                if (elm.label === updateKey) {
                  console.log('saving', updateKey, action.payload, element);
                  elm.value = action.payload.data[updateKey];
                  return elm;
                }
              });
            });
          } else {
            Object.keys(action.payload.data).some((updateKey: string) => {
              if (element.label === updateKey) {
                console.log('saving', updateKey, action.payload, element);
                element.value = action.payload.data[updateKey];
                return element;
              }
            });
          }
        });
      }
    },

    setNodeSelected: (state, action: PayloadAction<{ id: string; selected: boolean }>) => {
      const nodeToUpdate = state.nodes.find((n) => n.id === action.payload.id);
      if (nodeToUpdate) {
        nodeToUpdate.selected = action.payload.selected;
      }
      console.log(current(nodeToUpdate));
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
      console.log('adding!!', action.payload);
      state.nodes.push(action.payload);
    }),
    builder.addCase(saveNode.fulfilled, (state, action) => {
      state.nodes.push(action.payload)
    });
  },
});

// Action creators, reducers, and selectors
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
  onEdgesChange,
  setEditState,
  setNodeSelected,
  resetGraph,
  setActiveProject
} = graph.actions;

export const graphNodes = (state: RootState) => state.graph.nodes;
export const graphEdges = (state: RootState) => state.graph.edges;
export const selectNodeValue = (state: RootState, id: string, label: string) => {
  const node = state.graph.nodes.find((node: any) => {
    return node.id === id;
  });
  if (node) return node.data.elements.flat().find((element: any) => element.label === label).value;
  return '';
};

export const selectNode = (state: RootState, id: string) =>
  state.graph.nodes.find((node: any) => {
    return node.id === id;
  });

export const selectEditLabel = (state: RootState) => state.graph.editLabel;
export const selectEditId = (state: RootState) => state.graph.editId;
export const selectEditValue = (state: RootState) => state.graph.editValue;

export const selectEditState = createSelector([selectEditId, selectEditLabel], (id, label) => ({
  id,
  label,
}));

export default graph.reducer;
