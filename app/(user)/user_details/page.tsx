"use client"

import React, { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getCurrentProfile, updateCurrentProfile } from "./getProfile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  name: z.string().min(2, "Το όνοματεπώνυμο πρέπει να έχει τουλάχιστον 2 χαρακτήρες").max(88, "Υπερβήκατε το όριο των χαρακτήρων"),
  patronym: z.string().min(2).max(50),  
  email: z.string().email("Το email πρέπει να είναι της μορφής mike@example.com"),
  phone: z.string().min(10, "Το τηλέφωνο πρέπει να έχει 10 αριθμούς").max(10, "Το τηλέφωνο πρέπει να έχει 10 αριθμούς"),
  number_id: z.string().min(2, "Ο αριθμός ταυτότητας πρέπει να έχει τουλάχιστον 2 χαρακτήρες ").max(50, "Υπερβήκατε το όριο των χαρακτήρων"),
})

const Page = () => {
  const [loading, setLoading] = useState(true)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      patronym: "",
      email: "",
      phone: "",
      number_id: "",
    },
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentProfile()
        if (userData) {
          form.reset({
            name: userData.full_name || "",
            patronym: userData.patronym || "",
            email: userData.email || "",
            phone: userData.phone ? userData.phone.toString() : "",
            number_id: userData.number_id || "",
          })
        }
      } catch (error) {
        console.error("Error στην ανάχτηση των στοιχείων:", error)
        setErrorMessage("Error στην ανάχτηση των στοιχείων")
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitStatus("submitting")
    setErrorMessage(null)
    try {
      await updateCurrentProfile(values.name, values.patronym, values.email, Number.parseInt(values.phone), values.number_id)
      setSubmitStatus("success")
      console.log("Προφιλ ενημερώθηκε")
    } catch (error) {
      console.error("Error προφιλ δεν ενημερώθηκε:", error)
      setSubmitStatus("error")
      setErrorMessage("Error, Προσπαθήστε ξανά")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Προσωπικά Στοιχεία</h2>
      {submitStatus === "success" && (
        <Alert className="mb-4">
          <AlertTitle>Επιτυχία</AlertTitle>
          <AlertDescription>Τα στοιχεία του προφιλ σας ενημερώθηκαν με επιτυχία</AlertDescription>
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ονοματεπώνυμο</FormLabel>
                <FormControl>
                  <Input placeholder="πχ Μιχάλης Αγγελετόπουλος" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
      control={form.control}
      name="patronym"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Πατρώνυμο</FormLabel>
          <FormControl>
            <Input placeholder="πχ Παναγιώτης" {...form.register('patronym')} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="πχ example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τηλέφωνο</FormLabel>
                <FormControl>
                  <Input placeholder="πχ 6912345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Αριθμός Ταυτότητας</FormLabel>
                <FormControl>
                  <Input placeholder="πχ ΑΨ 1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={submitStatus === "submitting"}>
            {submitStatus === "submitting" ? "Updating..." : "Ενημέρωση στοιχείων"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Page

