import { EntitiesProvider } from '../context/EntitiesContext';
import { RelationshipsProvider } from '../context/RelationshipsContext';
import AddNewSpeedDial from './AddNewSpeedDial';
import DiagramEditor from './diagram/DiagramEditor';
import Header from './header/Header';

function Editor() {
  return (
    <EntitiesProvider>
      <RelationshipsProvider>
        <div className="page">
          <Header isEditor />
          <AddNewSpeedDial />
          <DiagramEditor />
        </div>
      </RelationshipsProvider>
    </EntitiesProvider>
  );
}

export default Editor;
