"use client";

import { useDisclosure } from "@nextui-org/react";
import { FC, createContext } from "react";

interface IContext {
  children: React.ReactNode;
}

export const useModalContext = createContext<boolean | any>(false);
const ModalProvider: FC<IContext> = ({ children }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  return (
    <useModalContext.Provider value={{ isOpen, onOpen, onOpenChange, onClose }}>
      {children}
    </useModalContext.Provider>
  );
};

export default ModalProvider;
