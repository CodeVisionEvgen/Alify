"use client"
import { Card } from '@nextui-org/card'
import Image from 'next/image'
import React from 'react'
import { StaticGenresType } from './genres'
import { GetStaticGenre } from '../actions/genres'

export default function GenreBox({ name }: { name: string | StaticGenresType }) {
  const genre = GetStaticGenre(name)
  return (
    <Card className='grid p-4 border-default-100 border bg-black justify-center gap-2'>
      <Image src={genre.thumb} alt='genre' width={170} height={170} unoptimized />
      <h2 className='w-full laila-font text-lg text-center font-lg'>{genre.name === "default" ? name : genre.name}</h2>
    </Card>
  )
}
