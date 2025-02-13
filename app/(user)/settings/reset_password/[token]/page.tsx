"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient();
  
    useEffect(() => {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          if (session) {
            // The session is available, you can now update the password
          } else {
            setError('Παρακαλώ προσπαθήστε ξανά')
          }
        }
      })
  
      return () => {
        authListener.subscription.unsubscribe()
      }
    }, [supabase.auth])
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      setMessage('')
      setIsLoading(true)
  
      if (password !== confirmPassword) {
        setError("Οι κωδικοί δεν ταιριάζουν")
        setIsLoading(false)
        return
      }
  
      try {
        const { data, error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        setMessage('Επιτυχής αλλαγή κωδικού. Ανακατεύθυνση προς την σύνδεση...')
        setTimeout(() => router.push('/login?reset=success'), 6000)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Αποτυχία αλλαγής κωδικού, παρακαλώ προσπαθήστε ξανά')
        }
      } finally {
        setIsLoading(false)
      }
    }
  
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Αλλαγή Κωδικού</CardTitle>
            <CardDescription>
              Πληκτρολογίστε τον νέο σας κωδικό
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Νέος κωδικός</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Επανάληψη νέου κωδικού</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Αλλάζει..." : "Αλλαγή κωδικού"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
}  

