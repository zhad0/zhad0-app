interface LogoZProps {
  size?: number;
  className?: string;
  glowIntensity?: number;
}

export function LogoZ({ size = 32, className = "", glowIntensity = 0.35 }: LogoZProps) {
  const pink = "hsl(328, 90%, 60%)";
  const id = "z-clip-" + size;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      style={{ filter: glowIntensity > 0 ? `drop-shadow(0 0 ${size * 0.3}px rgba(232,60,135,${glowIntensity}))` : undefined }}
    >
      <defs>
        <clipPath id={id}>
          <path d="M8 8 L92 8 L92 22 L22 78 L92 78 L92 92 L8 92 L8 78 L78 22 L8 22 Z" />
        </clipPath>
      </defs>

      {/* Grid lines clipped to Z shape */}
      <g clipPath={`url(#${id})`}>
        {[16, 26, 36, 46, 56, 66, 76, 86].map((v) => (
          <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} stroke={pink} strokeWidth="0.9" opacity="0.45" />
        ))}
        {[16, 26, 36, 46, 56, 66, 76, 86].map((v) => (
          <line key={`v${v}`} x1={v} y1="0" x2={v} y2="100" stroke={pink} strokeWidth="0.9" opacity="0.45" />
        ))}
      </g>

      {/* Z outline */}
      <path
        d="M8 8 L92 8 L92 22 L22 78 L92 78 L92 92 L8 92 L8 78 L78 22 L8 22 Z"
        stroke={pink}
        strokeWidth="2.5"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
