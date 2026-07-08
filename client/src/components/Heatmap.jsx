import './Heatmap.css';

/** Days-hit grid — filled squares for hit days, faint for missed. */
export function Heatmap({ days }) {
  return (
    <div className="heatmap">
      {days.map((hit, i) => (
        <span key={i} className={`cell ${hit ? 'cell-on' : ''}`} />
      ))}
    </div>
  );
}
