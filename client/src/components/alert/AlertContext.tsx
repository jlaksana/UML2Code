import { createContext, useCallback, useMemo, useState } from 'react';

const ALERT_TIME = 5000;
export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

type AlertContextType = {
  text: string | null;
  type: AlertType | null;
  setAlert: (text: string, type: AlertType) => void;
};

const AlertContext = createContext({} as AlertContextType);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState<string | null>(null);
  const [type, setType] = useState<AlertType | null>(null);

  const setAlert = useCallback((newText: string, newType: AlertType) => {
    setText(newText);
    setType(newType);

    setTimeout(() => {
      setText('');
      setType(null);
    }, ALERT_TIME);
  }, []);

  const value = useMemo(() => {
    return {
      text,
      type,
      setAlert,
    };
  }, [setAlert, text, type]);

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
}

export default AlertContext;
