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
import { login } from "@/lib/auth-actions"
import SignInWithGoogleButton from "./SignInWithGoogleButton"

export function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Σύνδεση</CardTitle>
        <CardDescription>
          Συμπληρώστε τα στοιχεία σας για να συνδεθείτε στον λογαριασμό σας
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action="">
            <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                <Label htmlFor="password">Κωδικός</Label>
                <Link href="/settings/reset_password" className="ml-auto inline-block text-sm underline">
                    Ξεχάσατε τον κωδικό?
                </Link>
                </div>
                <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" formAction={login} className="w-full">
                Σύνδεση
            </Button>
            <SignInWithGoogleButton/>
            </div>
            <div className="mt-4 text-center text-sm">
            Δεν έχετε λογαριασμό?{" "}
            <Link href="/signup" className="underline">
                Εγγραφή
            </Link>
            </div>
        </form>
      </CardContent>
    </Card>
  )
}
