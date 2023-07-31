import { EntitiesProvider } from '../context/EntitiesContext';
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
        <div className="editor">
          <Header />
          <AddNewSpeedDial />
          <Diagram />
        </div>
      </EntitiesProvider>
    </AlertProvider>
  );
}

export default Editor;
