"use client"
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

interface LoadingContextType {
  isLoading: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const LoadingData = createContext<LoadingContextType | undefined>(undefined);

export const useLoadingContext = (): LoadingContextType => {
  const context = useContext(LoadingData);
  if (!context) {
    throw new Error('useLoagindContext must be used within a LoadingProvider');
  }
  return context;
};

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <LoadingData.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingData.Provider>
  );
}
