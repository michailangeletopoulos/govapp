"use client";

import { Suspense, useState } from 'react'
import { useFormStatus, useFormState } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { updateEmail } from './update_email';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Αλλαγή...' : 'Αλλαγή Email'}
    </Button>
  )
}

function EmailChange() {
  const [state, formAction] = useFormState(updateEmail, null)
  const [email, setEmail] = useState('')

  const searchParams = useSearchParams()
  const resetSuccess = searchParams.get('reset') === 'success'

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Αλλαγή Email</CardTitle>
        <CardDescription>Θα σας αποσταλεί email επιβεβαίωσης στο παλαιό και καινούργιο
          email σας
        </CardDescription>
      </CardHeader>

      {resetSuccess && (
        <Alert className="mb-4 max-w-sm mx-auto">
          <AlertDescription>
            Αν έχετε επιβεβαιώσει την αλλαγή και από τα 2 email τότε η αλλαγή είχε επιτυχία.
          </AlertDescription>
        </Alert>
      )}
    
      <form action={formAction}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Καινούργιο Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {state?.error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{state.error}</span>
              </div>
            )}
            {state?.success && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span>{state.success}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  )
}
const EmailChangeForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailChange />
    </Suspense>
  );
};

export default EmailChangeForm;
