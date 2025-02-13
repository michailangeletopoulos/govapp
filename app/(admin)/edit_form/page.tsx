"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";

type Form = {
  id: string
  title: string
  category: string
}

type Category = {
  id: number
  category: string
}

export default function FormsListPage() {
  const router = useRouter()
  const [forms, setForms] = useState<Form[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    const fetchFormsAndCategories = async () => {
      const supabase = createClient()

      // Fetch forms
      const { data: formsData, error: formsError } = await supabase.from("form").select("id, title, category")

      if (formsError) {
        console.error("Error φόρτωσης φορμών:", formsError)
      } else {
        setForms(formsData || [])
      }

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("id, category")

      if (categoriesError) {
        console.error("Error φόρτωσης κατηγοριών:", categoriesError)
      } else {
        setCategories(categoriesData || [])
      }
    }

    fetchFormsAndCategories()
  }, [])

  const handleEdit = (id: string) => {
    router.push(`./edit_form/${id}`)
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Είστε σίγουρη/ος ότι θέλετε να διαγράψετε αυτή την φόρμα?")
    if (!confirmed) return

    const supabase = createClient()
    const { error } = await supabase.from("form").delete().eq("id", id)

    if (error) {
      console.error("Error διαγραφής φόρμας:", error)
    } else {
      setForms(forms.filter((form) => form.id !== id))
    }
    toast.success('Επιτυχής διαγραφή κατηγορίας');
  }

  const filteredForms = forms.filter((form) => {
    const matchesCategory = selectedCategory ? form.category === selectedCategory : true
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Λίστα φορμών</h1>
      <div className="flex space-x-4 mb-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Επιλογή Κατηγορίας" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλες οι κατηγορίες</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.category}>
                {category.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Αναζήτηση φόρμας..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[300px]"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Τίτλος</TableHead>
            <TableHead>Κατηγορία</TableHead>
            <TableHead>Ενέργειες</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredForms.map((form) => (
            <TableRow key={form.id}>
              <TableCell>{form.title}</TableCell>
              <TableCell>{form.category}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(form.id)} className="mr-2">
                  Τροποποίηση
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(form.id)}>
                  Διαγραφή
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredForms.length === 0 && <p className="text-center mt-4">Δεν βρέθηκε κάποια φόρμα να ικανοποιεί αυτά τα φίλτρα</p>}
    </div>
  )
}

