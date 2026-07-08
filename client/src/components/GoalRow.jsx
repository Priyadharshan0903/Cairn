import { Link } from 'react-router-dom';
import { ProgressTrack } from './ProgressTrack.jsx';
import { StatusChip, PaceTag } from './Badge.jsx';
import './GoalRow.css';

/** A goal in the priority list on the dashboard. */
export function GoalRow({ goal, index, dragHandle }) {
  const { pace } = goal;
  return (
    <Link to={`/goals/${goal.id}`} className="goal-row">
      <div className="goal-row-head">
        <span className="goal-index">{index + 1}</span>
        <span className="goal-title">{goal.title}</span>
        <StatusChip status={goal.status} />
      </div>
      <div className="goal-row-track">
        {dragHandle}
        <ProgressTrack pace={pace} />
      </div>
      <div className="goal-row-foot">
        <span className="goal-meta">
          {pace.actualPercent}% · target {pace.targetPercent}%
        </span>
        <PaceTag pace={pace} />
      </div>
    </Link>
  );
}
