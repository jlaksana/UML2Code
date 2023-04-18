import { Route, Routes } from 'react-router-dom';
import NotFound from './components/NotFound';
import StartMenu from './components/StartMenu';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartMenu />} />
      <Route path="/:id" element={<h1>Editor page</h1>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
