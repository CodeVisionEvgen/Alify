import { UploadFileIcon } from '@/assets/svgs';
import { Button } from '@nextui-org/button';
import React, { useRef, useState } from 'react';

interface FileInputProps {
  name: string;
}

export default function FileInput({ name }: FileInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  return (
    <div>
      <Button className='!w-[160px] !h-[160px]' color='danger' onClick={() => fileRef.current?.click()} variant='flat'>
        <div className="grid gap-5 justify-items-center">
          <UploadFileIcon width={50} height={50} fill='currentColor' />
          <p className='text-[14px] max-w-[140px] break-all text-wrap'>
            {selectedFileName.length > 1 ? selectedFileName : "Choose file"}
          </p>
        </div>
      </Button>
      <input
        ref={fileRef}
        type='file'
        className='hidden'
        name={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (event?.target?.files?.length) {
            setSelectedFileName(event.target.files[0].name);
          }
        }}
      />
    </div>
  );
}
