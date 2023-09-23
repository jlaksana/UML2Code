import { EntitiesProvider } from '../context/EntitiesContext';
import { RelationshipsProvider } from '../context/RelationshipsContext';
import AddNewSpeedDial from './AddNewSpeedDial';
import AlertToast from './alert/Alert';
import { AlertProvider } from './alert/AlertContext';
import DiagramEditor from './diagram/DiagramEditor';
import Header from './header/Header';

function Editor() {
  return (
    <AlertProvider>
      <AlertToast />
      <EntitiesProvider>
        <RelationshipsProvider>
          <div className="editor">
            <Header isEditor />
            <AddNewSpeedDial />
            <DiagramEditor />
          </div>
        </RelationshipsProvider>
      </EntitiesProvider>
    </AlertProvider>
  );
}

export default Editor;
