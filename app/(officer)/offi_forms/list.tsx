"use client";

import { useState } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Form = {
  id: number
  formTitle: string
  created_at: string
  done: boolean
}

export default function UserFormList({ forms }: { forms: Form[] }) {
  const [page, setPage] = useState(1)
  const formsPerPage = 10
  const totalPages = Math.ceil(forms.length / formsPerPage)

  const paginatedForms = forms.slice((page - 1) * formsPerPage, page * formsPerPage)

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>A/A</TableHead>
            <TableHead>Υπηρεσία</TableHead>
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
              <TableCell>{new Date(form.created_at).toLocaleDateString('el-GR')}</TableCell>
              <TableCell>{form.done ? 'Ολοκληρωμένο' : 'Σε εξέλιξη'}</TableCell>
              <TableCell>
                <Link href={`./offi_forms/${form.id}`}>
                  <Button variant="outline">Προβολή</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Προηγούμενο
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}