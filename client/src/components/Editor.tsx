import axios from 'axios';
import { EntitiesProvider } from '../context/EntitiesContext';
import { RelationshipsProvider } from '../context/RelationshipsContext';
import AddNewSpeedDial from './AddNewSpeedDial';
import DiagramEditor from './diagram/DiagramEditor';
import Header from './header/Header';

function Editor() {
  const authToken = localStorage.getItem('authToken');
  axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;

  return (
    <EntitiesProvider>
      <RelationshipsProvider>
        <div className="editor">
          <Header isEditor />
          <AddNewSpeedDial />
          <DiagramEditor />
        </div>
      </RelationshipsProvider>
    </EntitiesProvider>
  );
}

export default Editor;
