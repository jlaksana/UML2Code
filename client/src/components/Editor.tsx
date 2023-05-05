// import { useParams } from 'react-router-dom';
import AddNewSpeedDial from './AddNewSpeedDial';
import Diagram from './Diagram';
import Header from './Header';

function Editor() {
  // const { id } = useParams();

  return (
    <div className="editor">
      <Header />
      <AddNewSpeedDial />
      <Diagram />
    </div>
  );
}

export default Editor;
