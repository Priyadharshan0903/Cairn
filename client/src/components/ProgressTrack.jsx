import './ProgressTrack.css';

/**
 * The signature Cairn progress bar: a filled `actual` portion plus a vertical
 * TARGET marker at the "should be here" position.
 */
export function ProgressTrack({ pace, showMarkerLabel = false, height = 8 }) {
  const actual = Math.round(pace.actualPct * 100);
  const target = Math.round(pace.targetPct * 100);
  const fill = pace.status === 'ahead' ? 'var(--sage)' : 'var(--terracotta)';

  return (
    <div className="track-wrap">
      {showMarkerLabel && (
        <div className="track-marker-label" style={{ left: `${target}%` }}>
          TARGET
        </div>
      )}
      <div className="track" style={{ height }}>
        <div className="track-fill" style={{ width: `${actual}%`, background: fill }} />
        <div className="track-marker" style={{ left: `${target}%` }} />
      </div>
    </div>
  );
}
