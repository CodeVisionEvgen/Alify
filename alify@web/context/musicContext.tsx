"use client"
import { IMusic } from "@/types";
import { ReactNode, createContext, useContext, useState } from "react";

interface MusicContextType {
  musics: IMusic[];
  setMusics: React.Dispatch<React.SetStateAction<IMusic[]>>;
  activeMusic: IMusic | null;
  setActiveMusic: React.Dispatch<React.SetStateAction<IMusic | null>>;
}
const MusicsData = createContext<MusicContextType | undefined>(undefined);

export const useMusicContext = (): MusicContextType => {
  const context = useContext(MusicsData);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

export function MusicProvider({ children }: { children: ReactNode }) {
  const [musics, setMusics] = useState<IMusic[]>([]);
  const [activeMusic, setActiveMusic] = useState<IMusic | null>(null);

  return (
    <MusicsData.Provider value={{ musics, setMusics, activeMusic, setActiveMusic }}>
      {children}
    </MusicsData.Provider>
  );
}
