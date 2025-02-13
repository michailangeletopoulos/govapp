"use client";

import { useState, useEffect  } from "react"
import { useRouter, useSearchParams  } from "next/navigation"
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
import { resetPassword } from "@/lib/auth-actions"

export function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      await resetPassword(email)
      setMessage("Επιτυχής αίτηση αλλαγής κωδικού, επαληθεύστε την αλλαγή στο email σας")
      setTimeout(() => router.push("/login"), 10000)
    } catch (error) {
      setMessage("Σφάλμα αλλαγής κωδικού, παρακαλώ προσπαθήστε αργότερα")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Αλλαγή κωδικού</CardTitle>
        <CardDescription>
          Συμπληρώστε το email σας ώστε να σας έρθει email αλλαγής κωδικού
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Στέλνεται..." : "Αποστολή email αλλαγής κωδικού"}
            </Button>
          </div>
          {message && (
            <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )

}

