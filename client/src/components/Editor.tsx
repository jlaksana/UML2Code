import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EntitiesProvider } from '../context/EntitiesContext';
import { RelationshipsProvider } from '../context/RelationshipsContext';
import { DiagramContents } from '../types';
import { setDocumentTitle } from '../utils';
import AddNewSpeedDial from './AddNewSpeedDial';
import { AlertType } from './alert/AlertContext';
import useAlert from './alert/useAlert';
import DiagramEditor from './diagram/DiagramEditor';
import Header from './header/Header';

function Editor() {
  // interceptor that adds auth token to every request
  const authToken = localStorage.getItem('authToken');
  axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;

  const [diagram, setDiagram] = useState<DiagramContents>();

  const { diagramId } = useParams();
  const { setAlert } = useAlert();

  setDocumentTitle(diagram?.name || '');

  useEffect(() => {
    const fetchDiagram = async () => {
      try {
        const res = await axios.get(`/api/diagram/${diagramId}/contents`);
        setDiagram(res.data);
      } catch (error: any) {
        if (error.response.status === 401) {
          setAlert(
            'You are not authorized to view this diagram',
            AlertType.ERROR
          );
        } else {
          setAlert(
            'Could not fetch diagram contents. Try again',
            AlertType.ERROR
          );
        }
      }
    };
    fetchDiagram();
  }, [diagramId, setAlert]);

  const handleRenameDiagram = (name: string) => {
    setDiagram({ ...(diagram as DiagramContents), name });
  };

  return (
    <EntitiesProvider>
      <RelationshipsProvider>
        <div className="page">
          <Header
            name={diagram?.name}
            isEditor
            handleRename={handleRenameDiagram}
          />
          <AddNewSpeedDial />
          <DiagramEditor
            ent={diagram?.entities || []}
            rel={diagram?.relationships || []}
          />
        </div>
      </RelationshipsProvider>
    </EntitiesProvider>
  );
}

export default Editor;
