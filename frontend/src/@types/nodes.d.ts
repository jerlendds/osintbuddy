interface XYPosition {
  x: number;
  y: number;
}

interface ActiveProject {
  name: string;
  description: string;
  uuid: string;
  id: number;
}

interface EditState {
  editId: string;
  editLabel: string;
  editValue: string;
}




interface ActiveProjectGraph {
  id: number;
  uuid: string;
  name: string;
  description?: string
}

interface NodeMenu {
  id: string;
  node: HTMLElement;
  data: JSONObject;
  label: string;
  transforms: string[];
  bounds: DOMRect;
}

interface AddNode {
  id: number;
  type: string;
  position: XYPosition;
  data: any;
}

interface AddEdge {
  source: string;
  target: string;
  sourceHandle?: string | undefined;
  targetHandle?: string | undefined;
  type?: string | undefined;
}

type NodeTypes =
  | 'dropdown'
  | 'text'
  | 'number'
  | 'decimal'
  | 'upload'
  | 'title'
  | 'section'
  | 'image'
  | 'video'
  | 'json'
  | 'list'
  | 'table'
  | 'copy-text'
  | 'copy-code'
  | 'empty';

interface NodeInput {
  type: NodeTypes;
  label: string;
  style: React.CSSProperties;
  placeholder: string;
  options?: DropdownOption[];
  value?: string;
  icon?: any;
  title?: string;
  subtitle?: string;
  text?: string;
  dispatch: () => void;
  sendJsonMessage: () => void;
}

interface DropdownOption {
  label: string;
  tooltip: string;
}
