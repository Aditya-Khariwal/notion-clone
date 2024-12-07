"use server"

import { adminDb } from "@/firebase-admin"
import liveblocks from "@/lib/liveblocks"
import { auth } from "@clerk/nextjs/server"
export async function createNewDocument(){
    // auth.protect()
    const {sessionClaims, redirectToSignIn}  = await auth()
    
    const emailid = sessionClaims?.email!
    if (!emailid) {
        redirectToSignIn()
        // throw new Error("Invalid sessionClaims email: email is undefined or empty.");
    }
    const docCollectionRef = adminDb.collection("documents")
    const docRef = await docCollectionRef.add({
        title: "New Doc"
    })
    await adminDb.collection("users").doc(emailid).collection("rooms").doc(docRef.id).set({
        userId : emailid,
        role:"owner",
        createdAt: new Date(),
        roomId: docRef.id
    }) 
    return {docId: docRef.id}
}

export async function deleteDocument(roomId: string){
    const {userId, redirectToSignIn}  = await auth()
    if (!userId) {
        redirectToSignIn()
    }
    try {
        // delete the document reference itself
        await adminDb.collection("documents").doc(roomId).delete();
        const query = await adminDb.collectionGroup("rooms").where("roomId", "==", roomId).get();
        const batch = adminDb.batch();

        // delete the room referennce in the user's collection for every user in the room
        query.docs.forEach((doc) => {
            batch.delete(doc.ref)
        });
        await batch.commit();

        // delele te room in liveblocks
        await liveblocks.deleteRoom(roomId);

        return {success : true};
    } catch (error) {
        console.error(error);
        return {success: false};
    }

}

export async function inviteUserToDocument(roomId: string, email:string){
    const {userId, redirectToSignIn}  = await auth()
    if (!userId) {
        redirectToSignIn()
    }
    try {
        await adminDb.collection("users").doc(email).collection("rooms").doc(roomId).set({
            userId:email,
            role:"editor",
            createdAt: new Date(),
            roomId
        })
        return {success : true}
    } catch (error) {
        console.error(error);
        return {success: false};
    }
}

export async function removeUserFromDocument(roomId:string, email:string){
    const {userId, redirectToSignIn}  = await auth()
    if (!userId) {
        redirectToSignIn()
    }
    try {
        await adminDb.collection("users").doc(email).collection("rooms").doc(roomId).delete()
        return {success : true}
    } catch (error) {
        console.error(error);
        return {success: false};
    }
}