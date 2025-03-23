"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteForm } from "./deleteForm";

export default function DeleteFormButton({ formId }: { formId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteForm(formId)
    if (result.success) {
      router.push("/forms/submitted_forms")
    } else {
      alert("Αποτυχία διαγραφής φόρμας, παρακαλώ προσπαθήστε ξανά.")
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="mt-4">
          Διαγραφή Φόρμας
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
          <AlertDialogDescription>
            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Αυτό θα διαγράψει μόνιμα τη φόρμα και όλα τα σχετικά δεδομένα.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Διαγραφή..." : "Διαγραφή"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

