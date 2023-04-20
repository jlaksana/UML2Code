import { useParams } from 'react-router-dom';
import '../styles/Editor.css';
import AddNewSpeedDial from './AddNewSpeedDial';
import Header from './Header';

function Editor() {
  const { id } = useParams();

  return (
    <div className="editor">
      <Header />
      <h1>Editor page for {id}</h1>
      <AddNewSpeedDial />
    </div>
  );
}

export default Editor;
