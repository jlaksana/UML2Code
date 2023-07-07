import CreditCardSharpIcon from '@mui/icons-material/CreditCardSharp';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import NorthRoundedIcon from '@mui/icons-material/NorthRounded';
import { Tooltip } from '@mui/material';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useState } from 'react';
import ClassModal from './forms/ClassModal';
import InterfaceModal from './forms/InterfaceModal';

function AddNewSpeedDial() {
  const [classOpen, setClassOpen] = useState(false);
  const [interfaceOpen, setInterfaceOpen] = useState(false);

  const actions = [
    { icon: <CreditCardSharpIcon />, name: 'Class', actionType: 'Class' },
    { icon: <GavelRoundedIcon />, name: 'Interface', actionType: 'Interface' },
    {
      icon: <FormatListNumberedRoundedIcon />,
      name: 'Enumeration',
      actionType: 'Enumeration',
    },
    {
      icon: <NorthRoundedIcon />,
      name: 'Relationship',
      actionType: 'Relationship',
    },
  ];

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'Class':
        setClassOpen(true);
        break;
      case 'Interface':
        setInterfaceOpen(true);
        break;
      case 'Enumeration':
        break;
      case 'Relationship':
        break;
      default:
        // Should never happen
        break;
    }
  };

  return (
    <>
      <Tooltip title="Add New" arrow>
        <SpeedDial
          ariaLabel="Add New SpeedDial"
          sx={{ position: 'absolute', bottom: '5vh', right: '5vh' }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={() => handleAction(action.actionType)}
            />
          ))}
        </SpeedDial>
      </Tooltip>
      <ClassModal open={classOpen} handleClose={() => setClassOpen(false)} />
      <InterfaceModal
        open={interfaceOpen}
        handleClose={() => setInterfaceOpen(false)}
      />
    </>
  );
}

export default AddNewSpeedDial;
