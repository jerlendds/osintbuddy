interface FetchProps {
  pageSize: number;
  pageIndex: number;
}

interface NodeData {
  label: string;
  color: HexColor;
  icon: TablerIcon;
  style: {};
  elements: NodeInput[];
}

interface ApiNode {
  id: string;
  position: XYPosition;
  data: NodeData;
  type: 'base';
}

interface ApiTransforms {
  type: string;
  transforms: { label: string; icon: TablerIcon };
}

