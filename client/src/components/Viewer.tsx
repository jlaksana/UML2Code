import AlertToast from './alert/Alert';
import { AlertProvider } from './alert/AlertContext';
import DiagramViewer from './diagram/DiagramViewer';
import Header from './header/Header';

function Viewer() {
  return (
    <AlertProvider>
      <AlertToast />
      <div className="editor">
        <Header />
        <DiagramViewer />
      </div>
    </AlertProvider>
  );
}

export default Viewer;
