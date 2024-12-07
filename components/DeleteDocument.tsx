'use client'

import React, { useState, useTransition } from 'react'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { deleteDocument } from '@/actions/actions'
import { toast } from 'sonner'

function DeleteDocument() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const pathname = usePathname()
    const router = useRouter()

    const handleDelete = async() =>{
        const roomId = pathname.split("/").pop();
        if(!roomId) return;
        startTransition(async()=>{
            const {success} = await deleteDocument(roomId)
            if(success){
                setIsOpen(false);
                router.replace("/");
                toast.success("Room Deleted successfully!")
            }
            else{
                toast.error("Failed to delete room!")
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            
            <Button  className='bg-red-500 text-white hover:bg-red-500/80' variant={"destructive"}>
                <DialogTrigger>Delete</DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to Delete?</DialogTitle>
                    <DialogDescription>
                        This will delete the document and all its contents, removing all users from the document.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='sm:justify-end gap-2'>
                <Button  className='bg-red-500 text-white hover:bg-red-500/80' variant={"destructive"}
                onClick = {handleDelete}
                disabled={isPending}>
                    {isPending ? "Deleting..." : "Delete"}
                </Button>
                <DialogClose asChild>
                    <Button className='bg-slate-200 hover:bg-slate-200/80' type='button' variant={"secondary"}>
                        Close
                    </Button>
                </DialogClose>

                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default DeleteDocument
