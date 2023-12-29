import { useContext } from 'react';
import AlertContext from './AlertContext';

// custom hook to use alert context
// To use this hook, import it in the component you want to use it in:
// import useAlert from './useAlert';
// Then call it in the component:
// const { setAlert } = useAlert();
// Then use it:
// setAlert('Alert Message', AlertType.SUCCESS);
const useAlert = () => useContext(AlertContext);

export default useAlert;
