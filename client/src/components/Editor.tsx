import { Switch } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Editor.css';
import { AcceptedTypes } from '../types';
import AddNewSpeedDial from './AddNewSpeedDial';
import Header from './Header';
import TypeSelect from './selects/TypeSelect';

function Editor() {
  const { id } = useParams();

  const [type, setType] = useState<AcceptedTypes>(null);
  const [error, setError] = useState(false);

  return (
    <div className="editor">
      <Header />
      <h1>Editor page for {id}</h1>
      <Switch
        onChange={() => {
          setError(!error);
        }}
      />
      <TypeSelect option={type} setOption={setType} error={error} />
      <AddNewSpeedDial />
    </div>
  );
}

export default Editor;
