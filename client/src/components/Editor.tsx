import { EntitiesProvider } from '../context/EntitiesContext';
import AddNewSpeedDial from './AddNewSpeedDial';
import Header from './Header';
import Diagram from './diagram/Diagram';

function Editor() {
  return (
    <EntitiesProvider>
      <div className="editor">
        <Header />
        <AddNewSpeedDial />
        <Diagram />
      </div>
    </EntitiesProvider>
  );
}

export default Editor;
