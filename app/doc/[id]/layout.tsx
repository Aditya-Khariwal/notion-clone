import RoomProvider from "@/components/RoomProvider"
import { auth } from "@clerk/nextjs/server"
import React from "react"

async function Doclayout({children, params:{id}}:{
    children:React.ReactNode
    params:{
        id:string
    }
}) {
    const { userId, redirectToSignIn } = await auth()
    if (!userId) return redirectToSignIn()
  return (
    <RoomProvider roomId={id}>
      {children}
    </RoomProvider>
  )
}

export default Doclayout
