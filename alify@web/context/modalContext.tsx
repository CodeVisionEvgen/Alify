"use client"
import { IModal } from "@/types";
import { ModalProps } from "@nextui-org/modal";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

interface ModalContextType {
  modal: IModal | null,
  setModal: Dispatch<SetStateAction<IModal | null>>
  setModalProps: Dispatch<SetStateAction<Omit<ModalProps, "children"> | null>>
  modalProps: Omit<ModalProps, "children"> | null
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
  const [modalProps, setModalProps] = useState<Omit<ModalProps, "children"> | null>(null);
  return (
    <ModalData.Provider value={{ modal, setModal, modalProps, setModalProps }}>
      {children}
    </ModalData.Provider>
  );
}
