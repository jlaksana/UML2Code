import DiagramViewer from './diagram/DiagramViewer';
import Header from './header/Header';

function Viewer() {
  return (
    <div className="editor">
      <Header />
      <DiagramViewer />
    </div>
  );
}

export default Viewer;
