import { Navigate } from 'react-router-dom';

function Home() {
  const user = localStorage.getItem('userId');
  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Home;
