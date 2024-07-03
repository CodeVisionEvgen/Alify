/* eslint-disable jsx-a11y/media-has-caption */
"use client"
import { FavoriteIcon, ShuffleIcon, RepeatIcon, SkipPrevIcon, PlayIcon, SkipNextIcon, VolumeIcon, VolumeDownIcon, VolumeOffIcon, PauseIcon } from '@/assets/svgs'
import { Button } from '@nextui-org/button'
import { Slider } from '@nextui-org/slider'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion"
import BlockDefault from '../block'
import Image from 'next/image'
import { IMusic } from '@/types'
import { useMusicContext } from '@/context/musicContext'
export default function AudioPlayer({ musics }: { musics: IMusic[] }) {
  const { setActiveMusic, activeMusic } = useMusicContext();
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const [volume, setVolume] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>();
  const [audioMetadata, setAudioMetadata] = useState<null | {
    duration: number;
    currentTime: number;
  }>(null)



  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error: any) => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (activeMusic && audioRef.current) {
      const playAudio = async () => {
        if (audioRef.current) {

          try {
            audioRef.current.load();
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (error: any) {
            if (error.name === 'AbortError') {
              console.log('Audio playback was aborted.');
            } else {
              console.error('Failed to play audio:', error);
            }
          }
        }
      };

      playAudio();
    }
  }, [activeMusic]);

  return (
    <>
      {activeMusic &&
        <span className="absolute left-0 bottom-5 w-screen">
          <div className="w-screen flex justify-center">
            <div className="flex items-end gap-3">
              <BlockDefault>
                <Button size="sm" isIconOnly startContent={<FavoriteIcon fill="currentColor" />} />
                <Button size="sm" isIconOnly startContent={<ShuffleIcon fill="currentColor" />} />
                <Button size="sm" isIconOnly startContent={<RepeatIcon fill="currentColor" />} />
              </BlockDefault>
              <BlockDefault className='flex items-center max-w-[370px] max-h-[80px] overflow-hidden gap-5'>
                <div className="grid">
                  <div className="abel-font text-base  text-left w-[200px] overflow-hidden">
                    <motion.p className='text-base w-full text-left overflow-ellipsis leading-5 overflow-hidden whitespace-nowrap !h-[20px]' transition={{
                      ease: "linear",
                      duration: 4,
                      repeat: Infinity,
                    }
                    } animate={{
                      x: [-300, 300]
                    }}>
                      {activeMusic.author + " - " + activeMusic.name}
                    </motion.p>
                  </div>
                  <p className=' abel-font text-sm ml-2'>{activeMusic.genre}</p>
                  <div className='flex items-center'>
                    <div className=' !bg-opacity-0'>
                      <Button className=' !bg-opacity-0' size="sm" isIconOnly startContent={<SkipPrevIcon fill="currentColor" />} />
                      <Button className=' !bg-opacity-0' size="sm" isIconOnly startContent={isPlaying ? <PauseIcon fill="currentColor" /> : <PlayIcon fill='currentColor' />} onClick={togglePlayPause} />
                      <Button className=' !bg-opacity-0' size="sm" isIconOnly startContent={<SkipNextIcon fill="currentColor" />} />
                    </div>
                    <Slider
                      startContent={<p className=' text-[12px]'>{audioMetadata?.currentTime ? formatTime(audioMetadata?.currentTime) : "0:00"}</p>}
                      endContent={<p className=' text-[12px]'>{audioMetadata?.duration ? formatTime(audioMetadata?.duration) : "0:00"}</p>}
                      aria-label="range"
                      className=' w-[120px]'
                      renderThumb={(props) => (
                        <div
                          {...props}
                          className="group p-1 top-1/2 bg-white border-small border-white rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                        />
                      )}
                      size="sm"
                      color="foreground"
                      onChange={(num) => {
                        if (num) {
                          // @ts-ignore
                          audioRef.current.currentTime = num;
                        }
                      }}
                      renderValue={() => {
                        return audioMetadata?.currentTime ? formatTime(audioMetadata?.currentTime) : "0:00"
                      }}
                      maxValue={audioMetadata?.duration ? Math.floor(audioMetadata.duration) : 0}
                      minValue={0}
                      value={audioMetadata?.currentTime || 0}
                      defaultValue={audioMetadata?.currentTime || 0}
                    />
                  </div>
                </div>
                {
                  activeMusic &&
                  <Image objectFit="contain" width={80} height={80} className=' relative right-0' src={activeMusic.thumbnail} alt={activeMusic.name} />
                }
              </BlockDefault>
              <BlockDefault className='flex gap-1 pr-1 pl-1 items-center w-[150px]'>

                {
                  (volume || volume === 0) && (() => {
                    if (volume > 60) return <VolumeIcon className=' cursor-pointer' onClick={() => {
                      setVolume(0);
                      requestAnimationFrame(() => {
                        // @ts-ignore
                        audioRef.current.volume = 0;
                      })
                    }} width={40} fill="currentColor" />;
                    if (volume <= 0) return <VolumeOffIcon className=' cursor-pointer' onClick={() => {
                      setVolume(100);
                      requestAnimationFrame(() => {
                        // @ts-ignore
                        audioRef.current.volume = 1;
                      })
                    }} width={40} fill="currentColor" />;
                    if (volume <= 60) return <VolumeDownIcon width={40} fill="currentColor" />;
                  })()
                }
                <Slider
                  aria-label="volume"
                  renderThumb={(props) => (
                    <div
                      {...props}
                      className="group p-1 top-1/2 bg-white border-small border-white rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                    />
                  )}
                  size="sm"
                  color="foreground"
                  onChange={(num) => {
                    setVolume(num as number);
                    // @ts-ignore
                    audioRef.current.volume = num / 100;
                  }}
                  showTooltip
                  maxValue={100}
                  minValue={0}
                  value={volume}
                  defaultValue={volume}
                />
              </BlockDefault>
              {activeMusic && <audio onLoadedMetadata={() => {
                setAudioMetadata({
                  // @ts-expect-error
                  duration: audioRef.current?.duration,
                  // @ts-ignore
                  currentTime: audioRef.current?.currentTime,
                })
              }} preload="metadata" onTimeUpdate={() => {
                if (audioRef.current) {
                  setAudioMetadata({
                    currentTime: audioRef.current?.currentTime,
                    duration: audioRef.current?.duration,
                  })
                }
              }} onInput={() => {
                if (audioRef.current) {
                  setAudioMetadata({
                    currentTime: audioRef.current?.currentTime,
                    duration: audioRef.current?.duration,
                  })
                }
              }} className=' hidden' controls ref={audioRef as React.LegacyRef<HTMLAudioElement>}>
                <source src={`http://localhost:1488/api/proxy/${activeMusic.url}`} />
              </audio>
              }
            </div>
          </div>
        </span >
      }
    </>
  )
}