import { ErrorIcon, UploadIcon } from '@/assets/svgs';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import React, { FormEvent, useRef, useState } from 'react';
import FileInput from '../ui/fileInput';
import { getMusicList, uploadMusic } from '../actions/musics';
import { useLoadingContext } from '@/context/loadingContext';
import { useMusicContext } from '@/context/musicContext';
import { useModalContext } from '@/context/modalContext';

export default function CreateMusicModal() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string>("");
  const { setIsLoading } = useLoadingContext();
  const { setMusics } = useMusicContext();
  const { setModal } = useModalContext()

  async function handleFormEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (formRef.current) {
      const formData = new FormData(formRef.current);

      const musicInput = formRef.current.elements.namedItem('music') as HTMLInputElement;
      if (musicInput?.files?.length) {
        try {
          setIsLoading(true)
          await uploadMusic(formData);
          setIsLoading(false)
          const musics = await getMusicList();
          setMusics(musics.data);
          setModal(null);
        } catch (error: any) {
          setIsLoading(false)
          setError(error.response?.data?.message || "Upload failed");
        }
      } else {
        setError("Add a file");
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
        <div className="grid gap-5 w-[240px]">
          <Input name='name' size='sm' color='danger' variant="underlined" label="Name" />
          <Input name='author' size='sm' color='danger' variant="underlined" label="Author" />
          <Input name='genre' size='sm' color='danger' variant="underlined" label="Genre" />
        </div>
        <div className='w-full flex justify-center mt-10'>
          <FileInput name='music' />
        </div>
      </div>
      <Button color='danger' type="submit" variant="solid" startContent={<UploadIcon fill='currentColor' />} className='w-full'>Upload</Button>
    </form>
  );
}
