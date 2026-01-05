import { Navigate, useLocation } from 'react-router-dom';

export function DashboardRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/student${search}`} replace />;
}
