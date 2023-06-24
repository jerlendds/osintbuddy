import { XYPosition } from 'reactflow';

interface NodeMenu {
  id: string;
  node: HTMLElement;
  data: JSONObject;
  label: string;
  transforms: string[];
  bounds: DOMRect;
}

export interface AddNode {
  id: number;
  type: string;
  position: XYPosition;
  data: any;
}

export interface AddEdge {
  source: string;
  target: string;
  sourceHandle?: string | undefined;
  targetHandle?: string | undefined;
  type?: string | undefined;
}