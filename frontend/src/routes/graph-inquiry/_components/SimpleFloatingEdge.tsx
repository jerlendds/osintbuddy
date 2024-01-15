import { useCallback } from 'react';
import { useStore, getBezierPath, BaseEdge, EdgeLabelRenderer } from 'reactflow';

import { getEdgeParams } from './utils';
import classNames from 'classnames';
import { ChevronDoubleDownIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

function EdgeLabel({ transform, label }: { transform: string; label: string }) {
  return (
    <>
      {label && (
        <div
          style={{ transform }}
          className="absolute border-2 bg-slate-800/5 pointer-events-auto cursor-grab font-semibold border-slate-700 p-1 px-3  rounded-md text-[0.6rem] leading-none capitalize text-slate-500 hover:text-slate-400/80 backdrop-blur-md flex items-center justify-between  font-display"
        >
          <p className="flex items-center justify-between cursor-pointer">
            {label} <ChevronDownIcon className='h-4 w-4 ml-2 origin-center hover:rotate-3' />
          </p>
        </div>
      )}
    </>
  );
}

function SimpleFloatingEdge({ id, source, target, markerEnd, style, label }: JSONObject) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });
  console.log(style)
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        // strokeWidth={4}
        markerEnd={markerEnd}
        style={{ ...style, cursor: 'grab' }} />

      <EdgeLabelRenderer>
        <EdgeLabel label={label?.replace("_", " ")} transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`} />
        {/* <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
          }}
          className="nodrag nopan absolute  text-slate-400/95 p-1"
        >
          {label}
        </div> */}
      </EdgeLabelRenderer>
      {/* <path */}
      {/* /> */}
    </>

  );
}

export default SimpleFloatingEdge;
