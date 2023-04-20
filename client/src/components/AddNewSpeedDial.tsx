import CreditCardSharpIcon from '@mui/icons-material/CreditCardSharp';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import NorthRoundedIcon from '@mui/icons-material/NorthRounded';
import { Tooltip } from '@mui/material';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

function AddNewSpeedDial() {
  const actions = [
    { icon: <CreditCardSharpIcon />, name: 'Class' },
    { icon: <GavelRoundedIcon />, name: 'Interface' },
    { icon: <FormatListNumberedRoundedIcon />, name: 'Enumeration' },
    { icon: <NorthRoundedIcon />, name: 'Relationship' },
  ];

  return (
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
            onClick={() => console.log(`${action.name} clicked`)}
          />
        ))}
      </SpeedDial>
    </Tooltip>
  );
}

export default AddNewSpeedDial;
