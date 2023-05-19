import { useParams } from 'react-router-dom';
import AddNewSpeedDial from './AddNewSpeedDial';
import Header from './Header';
import { EntitiesProvider } from './context/EntitiesContext';
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
