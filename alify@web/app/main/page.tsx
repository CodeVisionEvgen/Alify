"use client"
import ArticleBox from '@/components/article/card'
import OpacityInput from '@/components/ui/input'
import { useMusicContext } from '@/context/musicContext'
import React, { useEffect, useState } from 'react'
import { Tooltip } from "@nextui-org/tooltip"
import { Button } from '@nextui-org/button'
import { MoreIcon, MusicLibraryIcon, NewIcon, UploadIcon } from '@/assets/svgs'
import SmallBox from '@/components/smallBox'
import { useModalContext } from '@/context/modalContext'
import CreateMusicModal from '@/components/modal/createMusicModal'
import { useRouter } from 'next/navigation'
import { GenreResponseType } from '@/types'
import { GetStaticGenre, getGenresList } from '@/components/actions/genres'
import GenreMusicModal from '@/components/modal/GenreMusicModal'
import { argsToAuthorName } from '@/utils/string'
export default function Page() {
  const { musics, setActiveMusic } = useMusicContext();
  const { setModal, setModalProps } = useModalContext();
  const [genres, setGenres] = useState<GenreResponseType[]>([]);

  useEffect(() => {
    getGenresList().then((data) => {
      setGenres(data.data);
    })
  }, [])
  const router = useRouter();
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="grid justify-items-center gap-5">
          <h1 className="milonga-font text-5xl select-none">Alify</h1>
          <OpacityInput />
        </div>
        <div className="flex gap-5">
          <ArticleBox title="Authors">
          </ArticleBox>
          <ArticleBox title="Recent" action={
            <Tooltip size='sm' content="Upload new music">
              <Button onClick={() => {
                setModal({
                  modalHeader: <p className=' flex gap-2 items-center text-danger-400'><NewIcon fill='currentColor' className=' inline' /> Upload music</p>,
                  modalBody: <CreateMusicModal />
                })
              }} color='danger' variant="ghost" size="sm" className=' w-[98px] font-bold h-6' startContent={<UploadIcon fill='currentColor' />}>Upload</Button>
            </Tooltip>
          }>
            {
              musics.length ?
                <div className="flex gap-6">
                  {musics.map((music, i) => {
                    if (i <= 1) {
                      return <SmallBox onClick={() => {
                        setActiveMusic(music);
                      }} ToolTipContent={argsToAuthorName(music?.author, music?.name)} thumbnail={music.thumbnail} alt={music.name} key={i} />
                    } else if (i == 2) {
                      return <Tooltip key={i} showArrow placement='bottom' content="More">
                        <Button onClick={() => {
                          router.push('/main/music')
                        }} size="sm" className=' !h-[56px] !w-[56px] text-lg' color='danger' variant="shadow" startContent={<MoreIcon fill='currentColor' />} isIconOnly />
                      </Tooltip>
                    }
                  })}
                </div>
                : ""
            }
          </ArticleBox>
          <ArticleBox action={<Button className=' font-bold' size='sm' color='danger' variant='bordered' startContent={<MusicLibraryIcon fill='currentColor' />} onClick={() => {
            router.push('/main/genre')
          }}>Open</Button>} title="Genres">
            {
              genres.length ?
                <div className="flex gap-6">
                  {genres.map((genre, i) => {
                    if (i <= 1) {
                      return <SmallBox onClick={() => {
                        setModalProps({
                          size: "5xl",
                          placement: "top"
                        })
                        setModal({
                          modalHeader: `${genre.name}`,
                          modalBody: <GenreMusicModal genre={genre.name} />
                        })
                      }} ToolTipContent={genre.name} thumbnail={GetStaticGenre(genre.name).thumb} alt={genre.name} key={i} />
                    } else if (i == 2) {
                      return <Tooltip key={i} showArrow placement='bottom' content="More">
                        <Button onClick={() => {
                          router.push('/main/genre')
                        }} size="sm" className=' !h-[56px] !w-[56px] text-lg' color='danger' variant="shadow" startContent={<MoreIcon fill='currentColor' />} isIconOnly />
                      </Tooltip>
                    }
                  })}
                </div>
                : ""
            }
          </ArticleBox>
        </div>
      </section>
    </>
  )
}
