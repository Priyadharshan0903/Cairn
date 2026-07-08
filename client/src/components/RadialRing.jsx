/** Circular progress ring with an optional target tick, used in card/complete views. */
export function RadialRing({ pace, size = 52, stroke = 5, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const actual = pace.actualPct;
  const color = pace.status === 'ahead' ? 'var(--sage)' : pace.status === 'behind' ? 'var(--terracotta)' : 'var(--sage-deep)';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - actual)}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          fontSize: size > 90 ? 22 : 13,
          fontWeight: 600,
        }}
      >
        {children ?? `${Math.round(actual * 100)}%`}
      </div>
    </div>
  );
}
