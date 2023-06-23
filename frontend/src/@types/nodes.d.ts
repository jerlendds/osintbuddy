interface FetchProps {
  pageSize: number;
  pageIndex: number;
}

interface NodeMenu {
  id: string;
  node: HTMLElement;
  data: JSONObject;
  label: string;
  transforms: string[];
  bounds: DOMRect;
}
