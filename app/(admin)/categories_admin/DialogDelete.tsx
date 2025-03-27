"use client";

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface DeleteAttachmentDialogProps {
  onConfirmDelete: () => Promise<void>
  itemName?: string
}

export function DeleteAttachmentDialog({ onConfirmDelete, itemName = "στοιχείο" }: DeleteAttachmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onConfirmDelete()
      setIsOpen(false)
      toast.success(`Επιτυχής διαγραφή`)
    } catch (error) {
      console.error("Error διαγραφής:", error)
      toast.error("Αποτυχής διαγραφή")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Διαγραφή</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Διαγραφή κατηγορίας</DialogTitle>
          <DialogDescription className="font-bold">
            Αν διαγράψετε αυτή την κατηγορία, οι φόρμες της δεν θα σβηστούν, οι χρήστες και οι υπάλληλοι 
            θα έχουν πρόσβαση στις φόρμες αυτής της κατηγορίας.
          </DialogDescription>
          <DialogDescription >
            Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή την κατηγορία? Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Διαγραφή..." : "Διαγραφή"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Ακύρωση
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

