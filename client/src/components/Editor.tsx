import { EntitiesProvider } from '../context/EntitiesContext';
import { RelationshipsProvider } from '../context/RelationshipsContext';
import AddNewSpeedDial from './AddNewSpeedDial';
import Header from './Header';
import AlertToast from './alert/Alert';
import { AlertProvider } from './alert/AlertContext';
import Diagram from './diagram/Diagram';

function Editor() {
  return (
    <AlertProvider>
      <AlertToast />
      <EntitiesProvider>
        <RelationshipsProvider>
          <div className="editor">
            <Header />
            <AddNewSpeedDial />
            <Diagram />
          </div>
        </RelationshipsProvider>
      </EntitiesProvider>
    </AlertProvider>
  );
}

export default Editor;
