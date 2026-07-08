import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.jsx';
import { AppShell } from './components/AppShell.jsx';
import { AuthScreen } from './screens/AuthScreen.jsx';
import { Dashboard } from './screens/Dashboard.jsx';
import { GoalDetail } from './screens/GoalDetail.jsx';
import { NewGoal } from './screens/NewGoal.jsx';
import { History } from './screens/History.jsx';
import { ActivityLog } from './screens/ActivityLog.jsx';
import { Trails } from './screens/Trails.jsx';
import { Profile } from './screens/Profile.jsx';
import { ThemeSettings } from './screens/ThemeSettings.jsx';
import { GoPro } from './screens/GoPro.jsx';

function FullLoader() {
  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
      <div className="spin" />
    </div>
  );
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullLoader />;
  if (!user) return <Navigate to="/welcome" replace state={{ from: location }} />;
  return children;
}

export function App() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route
        path="/welcome"
        element={loading ? <FullLoader /> : user ? <Navigate to="/" replace /> : <AuthScreen />}
      />

      <Route
        element={
          <Protected>
            <AppShell />
          </Protected>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/goals/new" element={<NewGoal />} />
        <Route path="/goals/:id" element={<GoalDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="/trails" element={<Trails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/theme" element={<ThemeSettings />} />
        <Route path="/upgrade" element={<GoPro />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
