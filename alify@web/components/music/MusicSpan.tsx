import { PauseIcon, PlayIcon } from '@/assets/svgs';
import { useMusicContext } from '@/context/musicContext';
import { IMusic } from '@/types';
import { Button } from '@nextui-org/button';
import React, { useEffect, useState } from 'react';

export default function MusicSpan({ music }: { music: IMusic }): JSX.Element | null {
  const { activeMusic, setActiveMusic, setIsPlaying, isPlaying } = useMusicContext();
  const [localIsPlay, setLocalIsPlay] = useState<boolean>(false);

  useEffect(() => {
    setLocalIsPlay(isPlaying);
  }, [isPlaying]);

  if (!music) return null;

  return (
    <span className='flex rounded p-1 gap-2'>
      <Button
        onClick={() => {
          if (music !== activeMusic) {
            setActiveMusic(music);
          }
          setIsPlaying((play) => !play);
        }}
        style={{
          backgroundImage: `url(${music.thumbnail})`,
        }}
        startContent={!localIsPlay ? <PlayIcon fill='white' className='!z-[99]' /> : <PauseIcon fill='white' className='!z-[99]' />}
        className='relative bg-cover bg-darken before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black before:opacity-50 before:rounded-full'
        radius="full"
        isIconOnly
        size='lg'
      ></Button>
      <div className="grid">
        <h4>{music.name}</h4>
        <h5 className='text-default-300 text-[12px]'>{music.author}</h5>
      </div>
    </span>
  );
}
