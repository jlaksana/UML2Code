import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Editor from './components/Editor';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Viewer from './components/Viewer';
import AlertToast from './components/alert/Alert';
import { AlertProvider } from './components/alert/AlertContext';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
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

  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <AlertToast />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/send-reset-password" element={<SendResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            <Route path="/:diagramId/edit" element={<Editor />} />
            <Route path="/:diagramId/view" element={<Viewer />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
