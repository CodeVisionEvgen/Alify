"use client"
import { Card, CardHeader, CardBody } from '@nextui-org/card'
import React, { ReactNode } from 'react'
import { motion } from "framer-motion";
import { Skeleton } from "@nextui-org/skeleton"


export default function ArticleBox({ title, children, action }: {
  title: string,
  action?: ReactNode,
  children?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1, scale: 1,
        y: [10, -1, 0],

      }}
      transition={{ duration: 0.5 }}>
      <Card className=" bg-opacity-40 border-none bg-black w-[270px] h-[200px] hover:scale-[1.01]">
        <CardHeader className='mt-5 flex justify-between'>
          <h2 className=" laila-font text-xl">{title}</h2>
          {action}
        </CardHeader>
        <CardBody className='flex gap-1 flex-wrap'>
          {
            children ? children : <>
              <Skeleton className=' w-[56px] h-[56px] bg-foreground-200 p-1 rounded-md' key={Math.random()} />
              <Skeleton className=' w-[56px] h-[56px] bg-foreground-200 p-1 rounded-md' key={Math.random()} />
              <Skeleton className=' w-[56px] h-[56px] bg-foreground-200 p-1 rounded-md' key={Math.random()} />
            </>
          }
        </CardBody>
      </Card>
    </motion.div>
  )
}
