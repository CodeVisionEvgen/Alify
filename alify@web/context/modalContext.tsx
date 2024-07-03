"use client"
import { IModal } from "@/types";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

interface ModalContextType {
  modal: IModal | null,
  setModal: Dispatch<SetStateAction<IModal | null>>
}

const ModalData = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalData);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<IModal | null>(null);

  return (
    <ModalData.Provider value={{ modal, setModal }}>
      {children}
    </ModalData.Provider>
  );
}
