import { ErrorIcon, GenresIcon, UploadIcon } from '@/assets/svgs'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useLoadingContext } from '@/context/loadingContext'
import { useModalContext } from '@/context/modalContext'
import { createGenre } from '../actions/genres'
import { ScrollShadow } from "@nextui-org/scroll-shadow"
import { Listbox, ListboxItem } from "@nextui-org/listbox"
import { IMusic } from '@/types'
import { getMusicWithoutGenres } from '../actions/musics'
import { Checkbox } from "@nextui-org/checkbox"
export default function CreateGenreModal() {
  const [error, setError] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const { setIsLoading } = useLoadingContext();
  const { setModal } = useModalContext();
  const [musicsWithoutGenres, setMusicsWithoutGenres] = useState<IMusic[]>([])

  useEffect(() => {
    const requset = getMusicWithoutGenres();
    requset.catch((err: any) => {
      setError(err.response?.data?.message);
    })
    requset.then(({ data }) => {
      setMusicsWithoutGenres(data);
    })
  }, [])

  async function handleFormEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const selectedMusics = formData.getAll('musics') as string[];
      const name = formData.get('name') as string;
      const data = {
        musics: selectedMusics,
        name: name
      }
      console.log(data)
      try {
        setIsLoading(true)
        await createGenre(data)
        setIsLoading(false)
        setModal(null);
      } catch (error: any) {
        setIsLoading(false)
        setError(error.response?.data?.message || "Process failed");
      }
    }
  }
  return (
    <form ref={formRef} className='grid gap-8' onSubmit={handleFormEvent}>
      {error && (
        <span className='text-warning-300 border-warning-300 p-1 gap-1 flex items-center border-2 rounded-md w-full'>
          <ErrorIcon fill='currentColor' className='inline' />
          <p className='inline'>{error}</p>
        </span>
      )}
      <div className="flex">
        <div className="grid gap-5 w-full">
          <Input name='name' size='sm' color='danger' variant="underlined" label="Name" />
          <ScrollShadow>
            <Listbox emptyContent="" color='danger'>
              {musicsWithoutGenres && musicsWithoutGenres.map((music) => {
                return (
                  <ListboxItem key={music.name} variant="flat" className=' cursor-pointer'>
                    <div className='flex gap-2 items-center text-danger'>
                      <label className='flex items-center'>
                        <Checkbox color='danger' name='musics' value={music._id} />
                        <GenresIcon fill='currentColor' className='inline' />
                        <p className='inline'>{music.name}</p>
                      </label>
                    </div>
                  </ListboxItem>
                )
              })}
            </Listbox>
          </ScrollShadow>
        </div>
      </div>
      <Button color='danger' type="submit" variant="solid" className='w-full'>Create</Button>
    </form>
  )
}
