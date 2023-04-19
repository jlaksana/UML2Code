import { Route, Routes } from 'react-router-dom';
import Editor from './components/Editor';
import NotFound from './components/NotFound';
import StartMenu from './components/StartMenu';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartMenu />} />
      <Route path="/:id" element={<Editor />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
