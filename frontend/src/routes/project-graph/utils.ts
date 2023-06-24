import dagre from 'dagre';

export const getLayoutedElements = (nodes: any, edges: any, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph().setGraph({});
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: node.width, height: node.height });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target, { label: '' });
  });
  dagre.layout(dagreGraph);

  nodes.forEach((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - node.width / 2,
      y: nodeWithPosition.y - node.height / 2,
    };
    return node;
  });

  return { nodes, edges };
};

