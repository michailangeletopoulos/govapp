"use client";

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Form = {
  id: string
  formTitle: string
  created_at: string
  done: boolean
  category: string
}

type Category = {
  id: string
  category: string
}

export default function UserFormList({ forms, categories }: { forms: Form[]; categories: Category[] }) {
  const [page, setPage] = useState(1)
  const [filteredForms, setFilteredForms] = useState<Form[]>(forms)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState("all")

  const formsPerPage = 10
  const totalPages = Math.ceil(filteredForms.length / formsPerPage)

  useEffect(() => {
    const filtered = forms.filter((form) => {
      const matchesSearch = form.formTitle.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" ? true : form.category === selectedCategory
      console.log(form.category);
      const matchesDate =
        (!startDate || new Date(form.created_at) >= startDate) && (!endDate || new Date(form.created_at) <= endDate)
      const matchesStatus = status === "all" ? true : status === "done" ? form.done : !form.done

      return matchesSearch && matchesCategory && matchesDate && matchesStatus
    })

    setFilteredForms(filtered)
    setPage(1)
  }, [forms, searchQuery, selectedCategory, startDate, endDate, status])

  const paginatedForms = filteredForms.slice((page - 1) * formsPerPage, page * formsPerPage)

  return (
    <div>
      <div className="mb-4 space-y-2">
        <Input placeholder="Αναζήτηση φόρμας..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <div className="flex space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Επιλογή κατηγορίας" />
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
          <DatePicker date={startDate} setDate={setStartDate} placeholderText="Από ημερομηνία" />
          <DatePicker date={endDate} setDate={setEndDate} placeholderText="Έως ημερομηνία" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Κατάσταση" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλες</SelectItem>
              <SelectItem value="done">Ολοκληρωμένες</SelectItem>
              <SelectItem value="pending">Σε εξέλιξη</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>A/A</TableHead>
            <TableHead>Υπηρεσία</TableHead>
            <TableHead>Κατηγορία</TableHead>
            <TableHead>Ημ/νία Υποβολής</TableHead>
            <TableHead>Κατάσταση</TableHead>
            <TableHead>Ενέργειες</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedForms.map((form, index) => (
            <TableRow key={form.id}>
              <TableCell>{(page - 1) * formsPerPage + index + 1}</TableCell>
              <TableCell>{form.formTitle}</TableCell>
              <TableCell>{form.category}</TableCell>
              <TableCell>{new Date(form.created_at).toLocaleDateString("el-GR")}</TableCell>
              <TableCell>{form.done ? "Ολοκληρωμένο" : "Σε εξέλιξη"}</TableCell>
              <TableCell>
                <Link href={`./submitted_forms/${form.id}`}>
                  <Button variant="outline">Προβολή</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
          Προηγούμενο
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Επόμενο
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

