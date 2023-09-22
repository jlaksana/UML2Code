import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Editor from './components/Editor';
import NotFound from './components/NotFound';
import CreateMenu from './components/forms/CreateMenu';
import StartMenu from './components/forms/StartMenu';
import theme from './theme';

function App() {
  axios.defaults.withCredentials = true;
  // interceptor that redirects to login page if user is not authenticated
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<StartMenu />} />
        <Route path="/create" element={<CreateMenu />} />
        <Route path="/:diagramId/edit" element={<Editor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
