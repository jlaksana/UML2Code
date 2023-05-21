import { useParams } from 'react-router-dom';
import { EntitiesProvider } from '../context/EntitiesContext';
import AddNewSpeedDial from './AddNewSpeedDial';
import Header from './Header';
import Diagram from './diagram/Diagram';

function Editor() {
  const { diagramId } = useParams();

  return (
    <EntitiesProvider diagramId={diagramId}>
      <div className="editor">
        <Header />
        <AddNewSpeedDial />
        <Diagram />
      </div>
    </EntitiesProvider>
  );
}

export default Editor;
