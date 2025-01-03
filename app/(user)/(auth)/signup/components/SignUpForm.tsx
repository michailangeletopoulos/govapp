import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/lib/auth-actions"

export function SignupForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Εγγραφή</CardTitle>
        <CardDescription>
          Συμπληρώστε τα στοιχεία σας
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action="">
            <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                <Label htmlFor="first-name">Όνομα</Label>
                <Input name="first-name" id="first-name" placeholder="Μιχαήλ" required />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="last-name">Επώνυμο</Label>
                <Input name="last-name" id="last-name" placeholder="Αγγελετόπουλος" required />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Κωδικός</Label>
                <Input name="password" id="password" type="password" />
            </div>
            <Button formAction={signup} type="submit" className="w-full">
                Δημιουργία λογαριασμού
            </Button>
            
            </div>
            <div className="mt-4 text-center text-sm">
            Έχετε ήδη λογαριασμό?{" "}
            <Link href="/login" className="underline">
                Σύνδεση
            </Link>
            </div>
        </form>
      </CardContent>
    </Card>
  )
}
