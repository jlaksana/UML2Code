import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DiagramContents } from '../types';
import { setDocumentTitle } from '../utils';
import { AlertType } from './alert/AlertContext';
import useAlert from './alert/useAlert';
import DiagramViewer from './diagram/DiagramViewer';
import Header from './header/Header';

function Viewer() {
  const [diagram, setDiagram] = useState<DiagramContents>();

  const { diagramId } = useParams();
  const { setAlert } = useAlert();

  setDocumentTitle(diagram?.name || '');

  useEffect(() => {
    const fetchDiagramContents = async () => {
      try {
        const res = await axios.get(
          `/api/diagram/${diagramId}/public/contents`
        );
        setDiagram(res.data);
      } catch (e) {
        setAlert('This diagram is not available to view.', AlertType.ERROR);
      }
    };
    fetchDiagramContents();
  }, [diagramId, setAlert]);
  return (
    <div className="page">
      <Header name={diagram?.name} />
      <DiagramViewer
        entities={diagram?.entities || []}
        relationships={diagram?.relationships || []}
      />
    </div>
  );
}

export default Viewer;
