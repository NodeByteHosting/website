"use client";

import { useDisclosure } from "@nextui-org/react";
import { FC, createContext } from "react";
import type { ModalContext } from 'types/providers';

interface ModalProviderProps {
  children: React.ReactNode;
}

export const useModalContext = createContext<ModalContext | null>(null);

const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  return (
    <useModalContext.Provider value={{ isOpen, onOpen, onOpenChange, onClose }}>
      {children}
    </useModalContext.Provider>
  );
};

export default ModalProvider;
