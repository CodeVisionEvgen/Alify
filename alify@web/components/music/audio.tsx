/* eslint-disable jsx-a11y/media-has-caption */
"use client"
import { FavoriteIcon, ShuffleIcon, RepeatIcon, SkipPrevIcon, PlayIcon, SkipNextIcon, VolumeIcon, VolumeDownIcon, VolumeOffIcon, PauseIcon } from '@/assets/svgs'
import { Button } from '@nextui-org/button'
import { Slider } from '@nextui-org/slider'
import React, { act, useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion"
import BlockDefault from '../block'
import Image from 'next/image'
import { IMusic } from '@/types'
import { useMusicContext } from '@/context/musicContext'
import { argsToAuthorName } from '@/utils/string'
import { use } from 'passport'
export default function AudioPlayer({ musics }: { musics: IMusic[] }) {
  const { setActiveMusic, activeMusic, isPlaying, setIsPlaying } = useMusicContext();
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(50);
  const audioRef = useRef<HTMLAudioElement>();


  useEffect(() => {
    if (audioRef.current !== undefined) {
      navigator.mediaSession.setPositionState({
        duration: audioRef.current.duration || 0,
        playbackRate: audioRef.current.playbackRate,
        position: audioRef.current.currentTime || 0
      });
    }
  }, [currentTime])

  function updatePositionState() {
    console.log(activeMusic, audioRef.current)
    if (activeMusic && audioRef.current) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: activeMusic.name,
        artist: activeMusic.author,
        album: activeMusic.genre,
        artwork: [
          { src: activeMusic.thumbnail, sizes: '96x96', type: 'image/png' },
          { src: activeMusic.thumbnail, sizes: '128x128', type: 'image/png' },
          { src: activeMusic.thumbnail, sizes: '192x192', type: 'image/png' },
          { src: activeMusic.thumbnail, sizes: '256x256', type: 'image/png' },
          { src: activeMusic.thumbnail, sizes: '384x384', type: 'image/png' },
          { src: activeMusic.thumbnail, sizes: '512x512', type: 'image/png' },
        ]
      });
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (activeMusic && audioRef.current) {
      const playAudio = async () => {
        if (audioRef.current) {

          try {
            audioRef.current.load();
            await audioRef.current.play();
            updatePositionState()
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
        <span className="absolute left-0 bottom-5 w-screen !z-[9999]">
          <div className="w-screen flex justify-center !z-[9999] [&>*]:!z-[9999]">
            <div className="flex items-end gap-3">
              <BlockDefault className='!z-[9999]'>
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
                      {argsToAuthorName(activeMusic.author, activeMusic.name)}
                    </motion.p>
                  </div>
                  <p className=' abel-font text-sm ml-2'>{activeMusic.genre || "<unknown>"}</p>
                  <div className='flex items-center'>
                    <div className=' !bg-opacity-0 !z-[9999]'>
                      <Button className=' !bg-opacity-0' size="sm" isIconOnly startContent={<SkipPrevIcon fill="currentColor" />} />
                      <Button className=' !bg-opacity-0' size="sm" isIconOnly startContent={isPlaying ? <PauseIcon fill="currentColor" /> : <PlayIcon fill='currentColor' />} onClick={togglePlayPause} />
                      <Button className=' !bg-opacity-0' size="sm" isIconOnly startContent={<SkipNextIcon fill="currentColor" />} />
                    </div>
                    {audioRef ?
                      <Slider
                        startContent={<p className=' text-[12px]'>{currentTime ? formatTime(currentTime) : "0:00"}</p>}
                        endContent={<p className=' text-[12px]'>{audioRef?.current?.duration ? formatTime(audioRef?.current?.duration) : "0:00"}</p>}
                        aria-label="range"
                        className=' w-[120px]'
                        renderThumb={(props) => (
                          <div
                            {...props}
                            className="group !z-[9999] p-1 top-1/2 bg-white border-small border-white rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                          />
                        )}
                        size="sm"
                        color="foreground"
                        onChange={(num) => {
                          if (audioRef.current !== undefined && num) {
                            setCurrentTime(num as number);
                            audioRef.current.currentTime = num as number;
                          }
                        }}
                        renderValue={() => {
                          return currentTime ? formatTime(currentTime) : "0:00"
                        }}
                        maxValue={audioRef?.current?.duration ? Math.floor(audioRef?.current?.duration) : 0}
                        minValue={0}
                        value={currentTime}
                      />
                      : ""}
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
              {activeMusic && <audio
                onTimeUpdate={() => {
                  if (audioRef.current !== undefined) {
                    setCurrentTime(audioRef.current.currentTime);
                  }
                }}
                onInput={(time: unknown) => {
                  setCurrentTime(time as number);
                }} preload="metadata" className=' hidden' controls ref={audioRef as React.LegacyRef<HTMLAudioElement>}>
                <source src={`/api/proxy/${activeMusic.url}`} />
              </audio>
              }
            </div>
          </div>
        </span >
      }
    </>
  )
}