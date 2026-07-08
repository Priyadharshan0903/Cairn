/** The Cairn stone-stack mark. `tone` sets the stone color. */
export function CairnMark({ size = 28, tone = '#f6efe4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <g fill={tone}>
        <ellipse cx="24" cy="37" rx="15" ry="5.5" />
        <ellipse cx="24" cy="26.5" rx="11.5" ry="5" />
        <ellipse cx="24" cy="17.5" rx="8" ry="4" />
        <ellipse cx="24" cy="10.5" rx="5" ry="3" />
      </g>
    </svg>
  );
}
