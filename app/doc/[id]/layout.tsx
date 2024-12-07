import RoomProvider from "@/components/RoomProvider"
import { auth } from "@clerk/nextjs/server"
import React from "react"

type tParams = Promise<{ slug: string[] }>;
async function Doclayout({ children, params }: {
  children: React.ReactNode
  params: tParams
}) {
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn()
  const { slug } = await params;
  const id = slug[1]
  return (

    <RoomProvider roomId={id}>
      {children}
    </RoomProvider>
  )
}

export default Doclayout
