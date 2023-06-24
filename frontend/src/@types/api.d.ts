interface FetchProps {
  pageSize: number;
  pageIndex: number;
}

interface ApiNode {
  id: string;
  position: XYPosition;
  data: {
    label: string;
    color: HexColor;
    icon: TablerIcon;
    style: {};
    elements: NodeInput[];
  };
  type: 'base';
}

interface ApiTransforms {
  type: string;
  transforms: { label: string; icon: TablerIcon };
}
