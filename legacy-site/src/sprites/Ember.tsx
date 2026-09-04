interface SpriteProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Ember({ className, style }: SpriteProps) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      shapeRendering="crispEdges" 
      className={className}
      style={{ imageRendering: 'pixelated', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#3a0a0a"><rect x="14" y="5" width="1" height="1"/><rect x="13" y="6" width="1" height="1"/><rect x="15" y="6" width="1" height="1"/><rect x="12" y="7" width="1" height="1"/><rect x="15" y="7" width="1" height="1"/><rect x="11" y="8" width="1" height="1"/><rect x="15" y="8" width="1" height="1"/><rect x="11" y="9" width="1" height="1"/><rect x="16" y="9" width="1" height="1"/><rect x="10" y="10" width="1" height="1"/><rect x="16" y="10" width="1" height="1"/><rect x="10" y="11" width="1" height="1"/><rect x="17" y="11" width="1" height="1"/><rect x="9" y="12" width="1" height="1"/><rect x="17" y="12" width="1" height="1"/><rect x="9" y="13" width="1" height="1"/><rect x="18" y="13" width="1" height="1"/><rect x="9" y="14" width="1" height="1"/><rect x="17" y="14" width="1" height="1"/><rect x="9" y="15" width="1" height="1"/><rect x="17" y="15" width="1" height="1"/><rect x="10" y="16" width="1" height="1"/><rect x="16" y="16" width="1" height="1"/><rect x="10" y="17" width="1" height="1"/><rect x="15" y="17" width="1" height="1"/><rect x="11" y="18" width="1" height="1"/><rect x="14" y="18" width="1" height="1"/><rect x="12" y="19" width="2" height="1"/></g><g fill="#F56B6B"><rect x="15" y="5" width="1" height="1"/><rect x="14" y="6" width="1" height="1"/><rect x="13" y="7" width="2" height="1"/><rect x="12" y="8" width="3" height="1"/><rect x="12" y="9" width="2" height="1"/><rect x="15" y="9" width="1" height="1"/><rect x="11" y="10" width="2" height="1"/><rect x="14" y="10" width="2" height="1"/><rect x="11" y="11" width="6" height="1"/><rect x="10" y="12" width="2" height="1"/><rect x="13" y="12" width="2" height="1"/><rect x="16" y="12" width="1" height="1"/><rect x="10" y="13" width="2" height="1"/><rect x="14" y="13" width="2" height="1"/><rect x="10" y="14" width="7" height="1"/><rect x="10" y="15" width="3" height="1"/><rect x="14" y="15" width="3" height="1"/><rect x="11" y="16" width="2" height="1"/><rect x="15" y="16" width="1" height="1"/><rect x="11" y="17" width="2" height="1"/><rect x="14" y="17" width="1" height="1"/><rect x="12" y="18" width="2" height="1"/></g><g fill="#ff9999"><rect x="14" y="9" width="1" height="1"/><rect x="13" y="10" width="1" height="1"/></g><g fill="#ffe8cc"><rect x="12" y="12" width="1" height="1"/><rect x="15" y="12" width="1" height="1"/></g><g fill="#1a0505"><rect x="12" y="13" width="2" height="1"/><rect x="16" y="13" width="2" height="1"/></g><g fill="#ff8844"><rect x="13" y="15" width="1" height="1"/><rect x="13" y="16" width="1" height="1"/><rect x="13" y="17" width="1" height="1"/></g><g fill="#ffcc44"><rect x="14" y="16" width="1" height="1"/></g>
    </svg>
  );
}
