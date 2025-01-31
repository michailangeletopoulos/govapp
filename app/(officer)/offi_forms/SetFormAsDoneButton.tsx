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
import { setFormAsDone } from "./setFormAsDone";

export default function SetFormAsDoneButton({ formId }: { formId: string }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleSetAsDone = async () => {
    setIsUpdating(true)
    const result = await setFormAsDone(formId)
    if (result.success) {
      router.refresh()
    } else {
      alert("Failed to update form status. Please try again.")
    }
    setIsUpdating(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mt-4 mr-4">Ολοκλήρωση Φόρμας</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ολοκλήρωση Φόρμας</AlertDialogTitle>
          <AlertDialogDescription>
            Είστε σίγουροι ότι θέλετε να ορίσετε αυτή τη φόρμα ως ολοκληρωμένη; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
          <AlertDialogAction onClick={handleSetAsDone} disabled={isUpdating}>
            {isUpdating ? "Ενημέρωση..." : "Ολοκλήρωση"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

