// components/Layout.tsx
"use client"
import { getMusicList } from '@/components/actions/musics';
import AudioPlayer from '@/components/music/audio';
import { useMusicContext } from '@/context/musicContext';
import { IMusic } from '@/types';
import React, { useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalContent, ModalFooter } from "@nextui-org/modal"
import { useDisclosure } from "@nextui-org/use-disclosure"
import { useModalContext } from '@/context/modalContext';
import { useLoadingContext } from '@/context/loadingContext';
import { Spinner } from "@nextui-org/spinner"
import { Card } from '@nextui-org/card';
export default function Layout({ children }: { children: React.ReactNode }) {
  const { musics, setMusics } = useMusicContext();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { modal } = useModalContext();
  const { isLoading } = useLoadingContext();

  useEffect(() => {
    if (modal) return onOpen()
    else onClose()
  }, [modal])

  useEffect(() => {
    getMusicList().then(({ data }) => {
      setMusics(data as IMusic[])
    })
  }, [])
  return (
    <>
      {isLoading && <div className=' w-screen h-screen absolute top-0 left-0 bg-[#00000090] z-50'>
        <div className="flex justify-center mt-40 z-50">
          <Card className='p-3 w-max h-max'>
            <Spinner size='lg' color='danger' />
          </Card>
        </div>
      </div>
      }
      <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{modal?.modalHeader}</ModalHeader>
          <ModalBody>{modal?.modalBody}</ModalBody>
          <ModalFooter>{modal?.modalFooter}</ModalFooter>
        </ModalContent>
      </Modal>
      {children}
      <AudioPlayer musics={musics} />
    </>
  );
}
