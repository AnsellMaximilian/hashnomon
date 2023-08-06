import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Notification from "@/components/Notification";

export type NotificationStatus = "ERROR" | "SUCCESS" | null;

interface NotificationContextData {
  showNotification: (message: string, status?: NotificationStatus) => void;
  hideNotification: () => void;
}

export const NotificationContext = createContext<NotificationContextData>({
  showNotification: () => {},
  hideNotification: () => {},
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [status, setStatus] = useState<NotificationStatus>(null);

  const showNotification = (message: string, status?: NotificationStatus) => {
    setNotification(message);
    setStatus(status ? status : null);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notification) {
      const autoClose = setTimeout(hideNotification, 4000);
      return () => clearTimeout(autoClose);
    }
  }, [notification]);

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      {notification && <Notification message={notification} status={status} />}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextData => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("Use 'useNotification' inside the appropriate provider.");
  }
  return context;
};
