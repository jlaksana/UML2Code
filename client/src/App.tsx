import { ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import Editor from './components/Editor';
import NotFound from './components/NotFound';
import StartMenu from './components/forms/StartMenu';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<StartMenu />} />
        <Route path="/:id" element={<Editor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
