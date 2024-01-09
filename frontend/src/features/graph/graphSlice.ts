/* eslint-disable */
import { AnyAction, createAsyncThunk, createSelector, createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { type RootState } from '@src/app/store';
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
  MarkerType,
} from 'reactflow';

export type ProjectViewModes = 'edit' | 'view'

export type PositionModes = 'manual' | 'force' | 'hierarchy' | 'tree' | 'cola' | 'right tree' | 'tree 1'

export interface Graph extends EditState {
  nodes: Node[];
  edges: Edge[];
  project: ActiveProject;
  viewMode: ProjectViewModes;
  positionMode: PositionModes
  showEdges: false,
  shownEdgesByNodeId: JSONObject[] 
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
  viewMode: 'edit',
  positionMode: 'manual',
  showEdges: false,
  shownEdgesByNodeId: []
};


export const saveNode = createAsyncThunk(
  'graph/saveNode',
  async ({ id, data, position }: { id: string; position: XYPosition; data: JSONObject }) => {
    return { id, data, position, type: 'edit' };
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
    setPositionMode: (state, action: PayloadAction<PositionModes>) => {
      state.positionMode = action.payload
    },
    setActiveProject: (state, action: PayloadAction<ActiveProjectGraph>) => {
      state.project.uuid = action.payload.uuid;
      state.project.name = action.payload.name;
      state.project.id = action.payload.id;
      state.project.description = action.payload?.description ?? '';
    },

    setEditLabel: (state, action: PayloadAction<string>) => {
      state.editLabel = action.payload;
    },
    // TODO abstract into one later...
    enableEntityEdit: (state, action: PayloadAction<string>) => {
      state.editId = action.payload;
      state.editLabel = "enableEditMode"
      state.nodes = state.nodes.map((node) => node.id === action.payload ?
        {
          ...node,
          type: 'edit'
        } : node
      )
    },
    disableEntityEdit: (state, action: PayloadAction<string>) => {
      state.editId = action.payload;
      state.editLabel = "disableEditMode"
      state.nodes = state.nodes.map((node) => node.id === action.payload ?
        {
          ...node,
          type: 'view'
        } : node
      )
    },
    setEditState: (state, action: PayloadAction<EditState>) => {
      state.editId = action.payload.editId;
      state.editLabel = action.payload.editLabel;
    },

    setAllNodes: (state, action) => {
      state.nodes = action.payload
    }, 
    setAllEdges: (state, action) => {
      state.edges = action.payload.map((edge: Edge) => {
        return { 
          ...edge,
          style: {
            strokeWidth: 2.5,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 19,
            height: 20,
            color: '#334155',
          },
        }
      })
    },
    saveUserEdits: (state, action) => {
      const { value, nodeId, label } = action.payload;
      const nodeToUpdate = state.nodes.find((n) => n.id === nodeId);
      if (nodeToUpdate)
        nodeToUpdate.data.elements.forEach((element: JSONObject) => {
          if (Array.isArray(element)) {
            element.forEach((elm: JSONObject) => {
              if (elm.label === label) {
                elm.value = value;
              }
            });
          } else {
            if (element.label === label) {
              element.value = value;
            }
          }
        });
    },

    onEdgesChange: (state, action) => {
      state.edges = [action.payload, ...state.edges];
      // state.edges = applyEdgeChanges(action.payload, state.edges)
    },

    onEdgeUpdate: (state, action) => {
      state.edges = updateEdge(action.payload.oldEdge, action.payload.newConnection, state.edges);
    },

    createEdge: (state, action) => {
      state.edges.push({
        ...action.payload,
        style: {
          strokeWidth: 2.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 19,
          height: 20,
          color: '#334155',
        },
      });
    },

    setViewMode: (state, action: PayloadAction<ProjectViewModes>) => {
      state.viewMode = action.payload
    },

    setEditValue: (state, action: PayloadAction<EditValue>) => {
      state.editValue = action.payload.value;
    },

    createNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },

    deleteNode: (state, action: PayloadAction<Node['id']>) => {
      // state.editId = action.payload
      // state.editLabel = 'deleteNode'
      state.nodes = state.nodes.filter((n) => n.id !== action.payload);
      state.edges = state.edges.filter((e) => e.target !== action.payload && e.source !== action.payload)
    },

    updateNodeFlow: (state, action: PayloadAction<NodeChange[]>) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },

    resetGraph: (state) => {
      state.nodes = [];
      state.edges = [];
      // state.positionMode = 'manual';
      // state.viewMode = 'edit';
    },

    updateNodeData: (state, action: PayloadAction<Node>) => {
      const nodeToUpdate = state.nodes.find((n) => n.id === action.payload.id);
      if (nodeToUpdate) {
        nodeToUpdate.data.elements.forEach((element: JSONObject, idx: number) => {
          if (Array.isArray(element)) {
            element.forEach((elm: JSONObject) => {
              Object.keys(action.payload.data).some((updateKey: string) => {
                if (elm.label === updateKey) {
                  elm.value = action.payload.data[updateKey];
                  return elm;
                }
              });
            });
          } else {
            Object.keys(action.payload.data).some((updateKey: string) => {
              if (element.label === updateKey) {
                element.value = action.payload.data[updateKey];
                return element;
              }
            });
          }
        });
      }
    },

    setNodeType: (state, action: PayloadAction<any>) => {
      state.nodes.forEach((node) => {
        node.type = action.payload;
      });
    },

    setNodeSelected: (state, action: PayloadAction<{ id: string; selected: boolean }>) => {
      const nodeToUpdate = state.nodes.find((n) => n.id === action.payload.id);
      if (nodeToUpdate) {
        nodeToUpdate.selected = action.payload.selected;
      }
    },

    updateNode: (state, action: PayloadAction<Node>) => {
      const editIdx = state.nodes.findIndex((n) => n.id === action.payload.id);
      state.nodes[editIdx] = action.payload;
    },

    updateEdgeEvent: (state, action: PayloadAction<UpdateEdgeEvent>) => {
      state.edges = updateEdge(action.payload.oldEdge, action.payload.newConnection, state.edges);
    },
    addNodeUpdate: (state, action: PayloadAction<any>) => {
      state.nodes.push(action.payload);
    },
  },
  extraReducers(builder) {
      builder.addCase(saveNode.fulfilled, (state, action) => {
        state.nodes.push(action.payload);
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
  enableEntityEdit,
  onEdgesChange,
  setEditState,
  setNodeSelected,
  resetGraph,
  setActiveProject,
  setNodeType,
  setViewMode,
  addNodeUpdate,
  disableEntityEdit,
  setAllNodes,
  setPositionMode,
  setAllEdges
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

export const selectAllNodes = (state: RootState) => state.graph.nodes;
export const selectAllEdges = (state: RootState) => state.graph.edges;
export const selectNode = (state: RootState, id: string) =>
  state.graph.nodes.find((node: any) => {
    return node.id === id;
  });


export const selectEditLabel = (state: RootState) => state.graph.editLabel;
export const selectEditId = (state: RootState) => state.graph.editId;
export const selectEditValue = (state: RootState) => state.graph.editValue;
export const selectViewMode = (state: RootState) => state.graph.viewMode;
export const selectPositionMode = (state: RootState) => state.graph.positionMode;

export const selectEditState = createSelector([selectEditId, selectEditLabel], (id, label): EditState => ({
  editId: id,
  editLabel: label,
}));

export default graph.reducer;
