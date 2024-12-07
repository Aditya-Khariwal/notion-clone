'use client'

import Document from "@/components/Document";
import { use } from 'react'
type Params =Promise<{ id: string } >;

function DocumentPage({params}: {
      params: Params
}) {
  const id = use(params).id
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id}/>
    </div>
  )
}

export default DocumentPage
