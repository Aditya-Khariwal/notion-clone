import RoomProvider from "@/components/RoomProvider"
import { auth } from "@clerk/nextjs/server"
import React from "react"

type Params = { id: string };
async function Doclayout({ children, params }: {
  children: React.ReactNode
  params: Promise<Params>
}) {
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn()
  const id = (await params).id
  return (

    <RoomProvider roomId={id}>
      {children}
    </RoomProvider>
  )
}

export default Doclayout
