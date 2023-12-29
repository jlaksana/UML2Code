import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const user = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('authToken');

  return user && username && token ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
