import React from 'react';
import { Tooltip } from "@nextui-org/tooltip";
import Image from 'next/image';

interface SmallBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  ToolTipContent: string;
  thumbnail: string;
  alt: string;

}

export default function SmallBox({ ToolTipContent, alt, thumbnail, ...rest }: SmallBoxProps) {
  return (
    <div
      className='hover:-translate-y-1'
      role="button"
      tabIndex={0}
      aria-hidden
      {...rest}
    >
      <Tooltip placement='bottom' showArrow content={`${ToolTipContent}`}>
        <div className='hover:scale-105 w-max bg-default-200 rounded-md'>
          <Image unoptimized className='rounded-md' src={thumbnail} width={56} height={56} alt={alt} />
        </div>
      </Tooltip>
    </div>
  );
}
