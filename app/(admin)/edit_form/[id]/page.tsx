"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCategories } from "@/app/(user)/user_details/getProfile"
import RichTextEditor from "../../make_form/RichTextEditor";
import FormFieldEditor from "../FormFieldEditor";
import FormPreview from "../../make_form/FormPreview";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react"

type FormData = {
  id: string
  title: string
  category: string
  context: string
  fields: FormField[]
}

type FormField = {
  id: string
  label: string
  type: "text" | "file"
  example: string
  info: string
}

type Categories = {
  id: number
  category: string
}

export default function EditFormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [categories, setCategories] = useState<Categories[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("form").select("*").eq("id", params.id).single()

      if (error) {
        console.error("Σφάλμα ανάκτησης δεδομένων φόρμας:", error)
        return
      }

      setFormData(data)
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories || [])
      setIsLoading(false)
    }

    const isUserLog = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser()
        
      if (!user) {
       router.push("/login?need_logIn=true")
      }
    };

    isUserLog()
    fetchData()
  }, [params.id])

  const handleUpdate = async () => {
    if (!formData) return

    const supabase = createClient()
    const { error } = await supabase
      .from("form")
      .update({
        title: formData.title,
        category: formData.category,
        context: formData.context,
        fields: formData.fields,
      })
      .eq("id", formData.id)

    if (error) {
      console.error("Error ενημέρωσης φόρμας:", error)
    } else {
      router.push("../edit_form")
      toast.success('Επιτυχής ενημέρωση φόρμας');
    }
  }

  const handleDelete = async () => {
    if (!formData) return

    const supabase = createClient()
    const { error } = await supabase.from("form").delete().eq("id", formData.id)

    if (error) {
      console.error("Error διαγραφής φόρμας:", error)
    } else {
      router.push("../edit_form")
      toast.success('Επιτυχής διαγραφή φόρμας');
    }
  }

  if (isLoading) {
    return <div>Φόρτωση...</div>
  }

  if (!formData) {
    return <div>Δεν βρέθηκε φόρμα</div>
  }

  return (
    <Card className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>Επεξεργασία Φόρμας</CardTitle>
        <CardDescription>Μπορείτε να επεξεργαστείτε τα δεδομένα της φόρμας</CardDescription>
      </CardHeader>
      <CardContent>
      <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <AlertCircle className="mr-2" />
              Λάβε υπόψιν ότι
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-blue-700">
              <li>Αν θες να αφήσεις μια κενή γραμμή, πληκτρολόγησε 2 φορές Ctrl+Enter</li>
              <li>
              Αν θες να χρησιμποιήσεις κάποιο πεδίο που έχει το ίδιο όνομα με έτοιμα πεδία που υπάρχουν,
              χρησιμοποίησε το έτοιμο πεδίο και όχι καινούργιο,
              για να συμπληρωθεί αυτόματα από το σύστημα να ο χρήστης το έχει καταχωρημένο στα στοιχεία
              του
              </li>
            </ul>
          </CardContent>
        </Card>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="title">Τίτλος Φόρμας</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="category">Κατηγορία</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Επιλογή Κατηγορίας" />
              </SelectTrigger>
              <SelectContent position="popper">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.category}>
                    {category.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label>Περιγραφή Φόρμας</Label>
            <RichTextEditor
              content={formData.context}
              onChange={(content) => setFormData({ ...formData, context: content })}
            />
          </div>
          <FormFieldEditor fields={formData.fields} onChange={(fields) => setFormData({ ...formData, fields })} />
        </div>
        <FormPreview title={formData.title} fields={formData.fields} context={formData.context} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={handleDelete}>
          Διαγραφή Φόρμας
        </Button>
        <div>
          <Button variant="outline" className="mr-2" onClick={() => router.push("../edit_form")}>
            Επιστροφή
          </Button>
          <Button onClick={handleUpdate}>Ενημέρωση Φόρμας</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

