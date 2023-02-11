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
