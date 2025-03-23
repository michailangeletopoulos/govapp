import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

type FormField = {
  id: string
  label: string
  type: "text" | "file" | "date"
  example: string
  info: string
}

type FormFieldEditorProps = {
  fields: FormField[]
  onChange: (fields: FormField[]) => void
}

const predefinedFields = [
  { id: "email", label: "Email", type: "text", example: "example@gmail.com" },
  { id: "patronym", label: "Πατρώνυμο", type: "text", example: "Παναγιώτης" },
  { id: "full_name", label: "Ονοματεπώνυμο", type: "text", example: "Μιχαήλ Αγγελετόπουλος" },
  { id: "phone", label: "Αριθμός Τηλεφώνου", type: "text", example: "6912345678" },
  { id: "number_id", label: "Αριθμός Ταυτότητας", type: "text", example: "ΑΤ1234" },
]

const FormFieldEditor: React.FC<FormFieldEditorProps> = ({ fields, onChange }) => {
  const addFormField = (type: "text" | "file" | "date") => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: "",
      type,
      example: "",
      info: "",
    }
    onChange([...fields, newField])
  }
  const onAddField = (event: React.MouseEvent, field: { id: string; label: string; type: string; example: string }) => {
      const newField: FormField = {
        id: field.id,
        label: field.label,
        type: field.type as "text" | "file" | "date",
        example: field.example,
        info: "",
      }
      onChange([...fields, newField])
    }

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeFormField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const items = Array.from(fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    onChange(items)
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Έτοιμα πεδία</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {predefinedFields.map((field) => (
                    <Button key={field.id} variant="outline" size="sm" onClick={(e) => onAddField(e, field)}>
                      {field.label}
                    </Button>
                  ))}
                </div>
      <h3 className="text-lg font-semibold mb-2">Πεδία Φόρμας</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-4 p-4 bg-gray-100 rounded-md"
                    >
                      <Label>Πεδίο</Label>
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
                          <SelectValue placeholder="Επιλέξτε τον τύπο του πεδίου" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Κείμενο</SelectItem>
                          <SelectItem value="file">Αρχείο</SelectItem>
                          <SelectItem value="date">Ημερομηνία</SelectItem>
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
                        placeholder="Πληκτρολογήστε πληροφορίες γι αυτό το πεδίο που θα πρέπει να γνωρίζει ο χρήστης"
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
      <div className="mt-4 space-x-2">
        <Button type="button" onClick={() => addFormField("text")}>
          Προσθήκη Πεδίο Κειμένου
        </Button>
        <Button type="button" onClick={() => addFormField("file")}>
          Προσθήκη Πεδίο Αρχείου
        </Button>
        <Button type="button" onClick={() => addFormField("date")}>
          Προσθέστε Πεδίο Ημερομηνίας
        </Button>
      </div>
    </div>
  )
}

export default FormFieldEditor

