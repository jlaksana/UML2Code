import { Switch } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Editor.css';
import { DataTypes, Visibility } from '../types';
import AddNewSpeedDial from './AddNewSpeedDial';
import Header from './Header';
import GroupSelect from './selects/GroupSelect';
import TypeSelect from './selects/TypeSelect';
import VisibilitySelect from './selects/VisibilitySelect';

function Editor() {
  const { id } = useParams();

  const [type, setType] = useState<DataTypes>('');
  const [visibility, setVisibility] = useState<Visibility>('+');
  const [retType, setRetType] = useState('');
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
      <VisibilitySelect
        option={visibility}
        setOption={setVisibility}
        error={error}
      />
      <GroupSelect
        option={retType}
        setOption={setRetType}
        error={error}
        label="Return"
        includePrimitives
        includeInterfaces
        includeClasses
      />
      <AddNewSpeedDial />
    </div>
  );
}

export default Editor;
