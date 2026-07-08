import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav.jsx';
import './AppShell.css';

/**
 * Responsive frame: on mobile a single scrolling column + fixed bottom nav;
 * on desktop a left rail with the content centered in a comfortable column.
 */
export function AppShell() {
  return (
    <div className="shell">
      <BottomNav />
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
