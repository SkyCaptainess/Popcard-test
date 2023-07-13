import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
  Dispatch,
} from "react";
import { toast } from "react-hot-toast";

export interface AppContext {
  modalOpen: boolean;
  setModalOpen: Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContext>({
  modalOpen: false,
  setModalOpen: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // WEB3
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        modalOpen,
        setModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  return useContext(AppContext);
};
