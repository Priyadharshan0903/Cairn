/** The Cairn ember mark — a single flame. `tone` sets the flame color. */
export function CairnMark({ size = 28, tone = '#f6efe4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 92 106" fill="none" aria-hidden>
      <path
        d="M46 4 C64 30 84 40 84 68 A38 38 0 1 1 8 68 C8 48 22 44 28 30 C34 46 40 44 44 36 C50 46 46 54 40 58 C48 60 54 54 54 46 C66 54 70 60 70 70 A24 24 0 1 1 22 70 C22 56 34 52 46 4 Z"
        fill={tone}
      />
    </svg>
  );
}
