"use client"
import { IMusic } from '@/types';
import React, { useEffect, useState } from 'react'
import { getMusicListByGenre } from '../actions/musics';
import MusicSpan from '../music/MusicSpan';

export default function GenreMusicModal({ genre }: { genre: string }) {
  const [musics, setMusics] = useState<IMusic[]>();
  useEffect(() => {
    getMusicListByGenre(genre).then(data => {
      setMusics(data.data);
    })
  }, [])
  return (
    <>
      {musics?.length ? musics.map(music => <MusicSpan key={music._id} music={music} />) : "Empty"}
    </>
  )
}
