import React from 'react'

export default function BlockDefault({ children, className }: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={" [&>*]:!bg-opacity-0 bg-default-50 bg-opacity-30 rounded-lg " + className} >
      {children}
    </div >
  )
}
