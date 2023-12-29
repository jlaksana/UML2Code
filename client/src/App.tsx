import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Editor from './components/Editor';
import NotFound from './components/NotFound';
import Viewer from './components/Viewer';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';
import SendResetPassword from './components/auth/SendResetPassword';
import Signup from './components/auth/Signup';
import Verify from './components/auth/Verify';
import theme from './theme';

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
  // interceptor that redirects to login page if user is not authenticated
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        window.location.href = '/dashboard';
      }
      return Promise.reject(error);
    }
  );
  // https://medium.com/@shirisha95/react-router-v6-simplified-protected-routes-85b209326a55

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/send-reset-password" element={<SendResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/:diagramId/edit" element={<Editor />} />
        <Route path="/:diagramId/view" element={<Viewer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
