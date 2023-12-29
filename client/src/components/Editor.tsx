import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EntitiesProvider } from '../context/EntitiesContext';
import { RelationshipsProvider } from '../context/RelationshipsContext';
import { DiagramContents } from '../types';
import AddNewSpeedDial from './AddNewSpeedDial';
import { AlertType } from './alert/AlertContext';
import useAlert from './alert/useAlert';
import DiagramEditor from './diagram/DiagramEditor';
import Header from './header/Header';

function Editor() {
  const [diagram, setDiagram] = useState<DiagramContents>();

  const { diagramId } = useParams();
  const { setAlert } = useAlert();

  useEffect(() => {
    try {
      const fetchDiagram = async () => {
        const res = await axios.get(`/api/diagram/${diagramId}/contents`);
        setDiagram(res.data);
      };
      fetchDiagram();
    } catch (error: any) {
      // TODO NOT WORKING
      if (error.response.status === 401) {
        setAlert(
          'You are not authorized to view this diagram',
          AlertType.ERROR
        );
      } else if (error.response.status === 404) {
        setAlert(
          'Could not fetch diagram contents. Try again',
          AlertType.ERROR
        );
      }
    }
  }, [diagramId, setAlert]);

  return (
    <EntitiesProvider value={diagram?.entities}>
      <RelationshipsProvider value={diagram?.relationships}>
        <div className="page">
          <Header name={diagram?.name} isEditor />
          <AddNewSpeedDial />
          <DiagramEditor />
        </div>
      </RelationshipsProvider>
    </EntitiesProvider>
  );
}

export default Editor;
