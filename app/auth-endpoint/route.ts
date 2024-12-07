import { adminDb } from '@/firebase-admin'
import liveblocks from '@/lib/liveblocks'
import { auth } from '@clerk/nextjs/server'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req:NextRequest) {
    const {sessionClaims, userId, redirectToSignIn } = await auth()
    if (!userId) return redirectToSignIn()
    const {room} = await req.json()

    const session = liveblocks.prepareSession(sessionClaims?.email!,{
        userInfo:{
            name:sessionClaims?.fullName!,
            email:sessionClaims?.email!,
            avatar:sessionClaims?.image!,
        }
    }) 
    // all the rooms that user has access to..
    const usersInRoom = await adminDb.collectionGroup("rooms").where("userId", "==", sessionClaims.email!).get()

    // is the room which we are about to access, is in the list of record that are stored on the user's rooms collection
    const userInRoom = usersInRoom.docs.find((doc)=>doc.id === room)

    if(userInRoom?.exists){
        session.allow(room, session.FULL_ACCESS);
        const {body, status} = await session.authorize();

        return new Response(body, {status});
    }
    else{
        return NextResponse.json(
            {message: "You are not in this room"},
            {status : 403}
        )
    }
}