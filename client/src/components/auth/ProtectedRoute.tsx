import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const user = localStorage.getItem('userId');

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
