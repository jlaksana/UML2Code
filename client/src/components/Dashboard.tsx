import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import DashTable from './DashTable';
import { AlertType } from './alert/AlertContext';
import useAlert from './alert/useAlert';
import DashHeader from './header/DashHeader';

function Dashboard() {
  // interceptor that adds auth token to every request
  const authToken = localStorage.getItem('authToken');
  axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;

  const [diagrams, setDiagrams] = useState([]);

  const navigate = useNavigate();
  const { setAlert } = useAlert();

  useEffect(() => {
    const getDiagrams = async () => {
      try {
        const res = await axios.get('/api/diagram');
        res.data.sort(
          (a: any, b: any) =>
            new Date(b.modified).getTime() - new Date(a.modified).getTime()
        );
        setDiagrams(res.data);
      } catch (err) {
        setAlert('Could not get diagrams. Please reload.', AlertType.ERROR);
      }
    };

    getDiagrams();
  }, [setAlert]);

  const handleNew = async () => {
    try {
      const diagram = await axios.post('/api/diagram', {
        userId: localStorage.getItem('userId'),
      });
      navigate(`/${diagram.data.id}/edit`);
      setAlert('New diagram created!', AlertType.SUCCESS);
    } catch (err) {
      setAlert(
        'Error creating new diagram. Please try again.',
        AlertType.ERROR
      );
    }
  };

  const handleDeleteDiagram = (diagramId: string) => {
    setDiagrams(diagrams.filter((diagram: any) => diagram.id !== diagramId));
  };

  const handleRenameDiagram = (diagramId: string, name: string) => {
    setDiagrams(
      diagrams.map((diagram: any) =>
        diagram.id === diagramId ? { ...diagram, name } : diagram
      ) as never[]
    );
  };

  return (
    <div className="page">
      <DashHeader />
      <div className="dashboard">
        <div className="dashboard-title">
          <Typography variant="h5">My Diagrams</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
          >
            New
          </Button>
        </div>
        <DashTable
          diagrams={diagrams}
          handleDeleteDiagram={handleDeleteDiagram}
          handleRenameDiagram={handleRenameDiagram}
        />
      </div>
    </div>
  );
}

export default Dashboard;
