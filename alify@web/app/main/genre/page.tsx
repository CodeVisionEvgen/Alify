"use client"
import { GenresIcon, NewIcon } from '@/assets/svgs'
import { getGenresList } from '@/components/actions/genres'
import Breadcrumb from '@/components/breadcrumb'
import GenreBox from '@/components/genre/genreBox'
import CreateGenreModal from '@/components/modal/createGenreModal'
import { useModalContext } from '@/context/modalContext'
import { GenreResponseType } from '@/types'
import { Button } from '@nextui-org/button'
import React, { useEffect, useState } from 'react'

export default function Page() {
  const { setModal } = useModalContext();
  const [genres, setGenres] = useState<GenreResponseType[]>([]);

  useEffect(() => {
    getGenresList().then((data) => {
      setGenres(data.data);
    })
  }, [])

  return (
    <div className='grid'>
      <Breadcrumb size='lg' />
      <div className="flex justify-between w-full items-center">
        <h3 className=' text-[55px]'>Genre</h3>
        <Button onClick={() => {
          setModal({
            modalHeader: <div className='flex items-center gap-2 text-danger-400'><NewIcon fill='currentColor' className='inline' /><p className='inline'>Genre</p></div>,
            modalBody: <CreateGenreModal />
          })
        }} color='danger' startContent={<GenresIcon fill='currentColor' />} variant="flat">Create genre</Button>
      </div>
      <div className="flex flex-wrap mt-5 gap-10 max-h-[500px] overflow-auto justify-left">
        {genres.length ? genres.map(genre => <GenreBox key={genre._id} name={genre.name} />) : "Loading"}
      </div>
    </div>
  )
}
