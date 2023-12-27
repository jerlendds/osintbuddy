export default function NewConnectionLine({ fromX, fromY, toX, toY }: JSONObject) {
  return (
    <g>
      <path
        fill="none"
        stroke={'#64748b'}
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#00000000"
        r={3}
        stroke={'#394778'}
        strokeWidth={1.5}
      />
    </g>
  );
};
