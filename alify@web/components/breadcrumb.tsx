"use client"
import { BreadcrumbItem, Breadcrumbs, BreadcrumbsProps } from '@nextui-org/breadcrumbs'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Breadcrumb(props: BreadcrumbsProps) {
  const [items, setItems] = useState<string[]>([]);
  const router = useRouter();
  useEffect(() => {
    let pathItems = window.location.pathname.split('/');
    pathItems = pathItems.map(item => {
      if (item) {
        return item[0].toUpperCase() + item.slice(1);
      } else return ""
    })
    setItems(pathItems)

  }, [])
  return (
    <Breadcrumbs {...props}>
      {items.length ? items.map((item, i) => {
        if (item) {
          return <BreadcrumbItem onClick={() => {
            router.push("/" + item.toLowerCase());
          }} key={i}>{item}</BreadcrumbItem>
        }
      }) : ""}
    </Breadcrumbs>
  )
}
