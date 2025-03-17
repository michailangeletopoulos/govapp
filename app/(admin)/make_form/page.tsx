"use client";

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getCategories } from "@/app/(user)/user_details/getProfile"
import { createClient } from "@/utils/supabase/client"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Info } from "lucide-react"
import FormPreview from "./FormPreview"
import RichTextEditor from "./RichTextEditor"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

type Categories = {
  id: number
  category: string
}

type FormField = {
  id: string
  label: string
  type: "text" | "file"
  example: string
  info: string
}

const predefinedFields = [
  { id: "email", label: "Email", type: "text", example: "example@gmail.com" },
  { id: "patronym", label: "Πατρώνυμο", type: "text", example: "Παναγιώτης" },
  { id: "full_name", label: "Ονοματεπώνυμο", type: "text", example: "Μιχαήλ Αγγελετόπουλος" },
  { id: "phone", label: "Αριθμός Τηλεφώνου", type: "text", example: "6912345678" },
  { id: "number_id", label: "Αριθμός Ταυτότητας", type: "text", example: "ΑΤ1234" },
]

const Page = () => {
  const [categories, setCategories] = useState<Categories[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [context, setContext] = useState("")
  const router = useRouter()

  useEffect(() => {
    isUserLog()
    fetchCategories()
  }, [])

  const isUserLog = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login?need_logIn=true")
    }
  }

  const fetchCategories = async () => {
    const categories = await getCategories()
    setCategories(categories || [])
    setIsLoading(false)
  }

  const addFormField = (type: "text" | "file") => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: "",
      type,
      example: "",
      info: "",
    }
    setFormFields([...formFields, newField])
  }

  const onAddField = (event: React.MouseEvent, field: { id: string; label: string; type: string; example: string }) => {
    const newField: FormField = {
      id: field.id,
      label: field.label,
      type: field.type as "text" | "file",
      example: field.example,
      info: "",
    }
    setFormFields([...formFields, newField])
  }

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeFormField = (id: string) => {
    setFormFields(formFields.filter((field) => field.id !== id))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const items = Array.from(formFields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setFormFields(items)
  }
  const isFormValid = () => {
    return title.trim() !== "" && selectedCategory !== "" && context.trim() !== "" && formFields.length > 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isFormValid()) {
      alert("Πρέπει να βάλετε έναν τίτλο, μια κατηγορία, μια περιγραφή και ένα τουλάχιστον πεδίο για την φόρμα")
      return
    }
    const supabase = createClient()

    const { data, error } = await supabase.from("form").insert([
      {
        title: title,
        category: selectedCategory,
        fields: formFields,
        context: context, 
      },
    ])

    if (error) {
      console.error("Αποτυχία προσθήκης στοιχείων:", error)
    } else {
      console.log("Επιτυχής δημιουργία φόρμας")
      setTitle("")
      setSelectedCategory("")
      setFormFields([])
      setContext("")
      toast.success("Επιτυχής δημιουργία φόρμας")
    }
  }

  return (
    <Card className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>Φτιάξε Φόρμα</CardTitle>
        <CardDescription>
          Με την βοήθεια του παρακάτω text editor γράψτε την περιγραφή σας και έπειτα συμπληρώστε τα πεδία που καλείται
          να συμπληρώσει ο χρήστης
        </CardDescription>
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
              Αν θες να χρησιμοποιήσεις κάποιο πεδίο που έχει το ίδιο όνομα με τα έτοιμα πεδία που υπάρχουν,
              χρησιμοποίησε το έτοιμο πεδίο και όχι καινούργιο,
              για να συμπληρωθεί αυτόματα από το σύστημα αν ο χρήστης το έχει καταχωρημένο στα στοιχεία
              του
              </li>
            </ul>
          </CardContent>
        </Card>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Τίτλος Φόρμας</Label>
              <Input
                id="title"
                placeholder="Πληκτρολογίστε τον τίτλο της φόρμας"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Κατηγορία</Label>
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Επιλέξτε κατηγορία" />
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
                content={context}
                onChange={setContext}
                //onAddField={onAddField}
              />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Έτοιμα πεδία</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {predefinedFields.map((field) => (
                <Button key={field.id} variant="outline" size="sm" onClick={(e) => onAddField(e, field)}>
                  {field.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Πεδία φόρμας</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {formFields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-4 p-4 bg-gray-100 rounded-md"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <Label>Πεδίο</Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" className="p-0 h-auto">
                                      <Info className="h-4 w-4" />
                                      <span className="sr-only">Πληροφορίες πεδίου</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Συμπληρώστε τα στοιχεία του πεδίου</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Input
                              value={field.label}
                              onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                              className="mb-2"
                              placeholder="Πληκτρολογήστε το όνομα του πεδίου"
                            />
                            <Select
                              value={field.type}
                              onValueChange={(value: "text" | "file") => updateFormField(field.id, { type: value })}
                            >
                              <SelectTrigger className="mb-2">
                                <SelectValue placeholder="Επιλέξτε τον τύπο" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Κείμενο</SelectItem>
                                <SelectItem value="file">Αρχείο</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              value={field.example}
                              onChange={(e) => updateFormField(field.id, { example: e.target.value })}
                              className="mb-2"
                              placeholder="Πληκτρολογήστε ένα παράδειγμα"
                            />
                            <Input
                              value={field.info}
                              onChange={(e) => updateFormField(field.id, { info: e.target.value })}
                              className="mb-2"
                              placeholder="Πληροφορίες για το πεδίο που θα βλέπει ο χρήστης"
                            />
                            <Button type="button" onClick={() => removeFormField(field.id)} className="mt-2">
                              Διαγραφή Πεδίου
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="mt-4 space-x-2">
            <Button type="button" onClick={() => addFormField("text")}>
              Προσθέστε Πεδίο Κειμένου
            </Button>
            <Button type="button" onClick={() => addFormField("file")}>
              Προσθέστε Πεδίο Αρχείου
            </Button>
          </div>
        </form>
        <FormPreview title={title} fields={formFields} context={context} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            setTitle("")
            setSelectedCategory("")
            setFormFields([])
            setContext("")
            toast.success("Επιτυχής εκκαθάριση φόρμας")
          }}
        >
          Ακύρωση
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          Δημιουργία Φόρμας
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Page

