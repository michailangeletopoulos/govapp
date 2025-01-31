"use client";

import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, Save, Check, ChevronsUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

import { createClient } from "@/utils/supabase/client";
import { getCategories, getOfficers } from '@/app/(user)/user_details/getProfile'
import { cn } from '@/lib/utils';
import { UUID } from 'crypto';

type Categories = {
  id: number;
  category: string;
  officer_id: string | null;
}

type Officer = {
  id: string;
  full_name: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Categories[]>([])
  const [officers, setOfficers] = useState<Officer[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isOfficersLoading, setIsOfficersLoading] = useState(true)
  const supabase = createClient();

  useEffect(() => {
    fetchCategories()
    fetchOfficers()
  }, [])

  const fetchCategories = async () => {
    
    setIsLoading(true)
    try {
      const categories = await getCategories();

      setCategories(categories || [])
    } catch (error) {
      console.error('Error εμφάνισης κατηγοριών:', error)
      toast.error('Αποτυχής εμφάνιση κατηγοριών')
    } finally {
      setIsLoading(false)
    }
  } 

  const fetchOfficers = async () => {
    setIsOfficersLoading(true)
    const officers = await getOfficers();

    setOfficers(officers || [])

    setIsOfficersLoading(false)
  }

  const handleEdit = (index: number, category: string) => {
    setEditingIndex(index)
    setEditValue(category)
  }

  const handleSave = async (index: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ category: editValue })
        .eq('id', categories[index].id)

      if (error) throw error

      const updatedCategories = [...categories]
      updatedCategories[index] = { ...updatedCategories[index], category: editValue }
      setCategories(updatedCategories)
      toast.success('Επιτυχής αλλαγή κατηγορίας')
    } catch (error) {
      console.error('Error αλλαγής κατηγορίας:', error)
      toast.error('Αποτυχής αλλαγή κατηγορίας')
    } finally {
      setEditingIndex(null)
    }
  }

  const handleDelete = async (index: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categories[index].id)

      if (error) throw error

      const updatedCategories = categories.filter((_, i) => i !== index)
      setCategories(updatedCategories)
      toast.success('Επιτυχής διαγραφή κατηγορίας')
    } catch (error) {
      console.error('Error διαγραφή κατηγορίας:', error)
      toast.error('Αποτυχής διαγραφή κατηγορίας')
    }
  }

  const handleAdd = async () => {
    try {
      const newCategory = 'New Category'
      const { data, error } = await supabase
        .from('categories')
        .insert({ category: newCategory })
        .select()

      if (error) throw error

      if (data) {
        setCategories([...categories, data[0]])
        toast.success('Επιτυχής προσθήκη κατηγορίας')
      }
    } catch (error) {
      console.error('Error προσθήκη κατηγορίας:', error)
      toast.error('Αποτυχής προσθήκη κατηγορίας')
    }
  }

  const handleOfficerChange = async (categoryId: number, officerId: string | null) => {
    try {
      // Ensure officerId is a valid UUID or null
      const validOfficerId = officerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(officerId) ? officerId : null

      const { error } = await supabase
        .from('categories')
        .update({ officer_id: validOfficerId })
        .eq('id', categoryId)

      if (error) throw error

      const updatedCategories = categories.map(cat =>
        cat.id === categoryId ? { ...cat, officer_id: validOfficerId } : cat
      )
      setCategories(updatedCategories)
      toast.success(validOfficerId ? 'Επιτυχής ανάθεση υπαλλήλου' : 'Επιτυχής αλλαγή')
    } catch (error) {
      console.error('Error ανάθεσης υπαλλήλου:', error)
      toast.error('Αποτυχής ανάθεση υπαλλήλου')
    }
  }

  const handleSaveChanges = async () => {
    toast.success('Οι αλλαγές αποθηκεύτηκαν')
  }

  if (isLoading) {
    return <div className="text-center mt-10">Φόρτωση Κατηγοριών...</div>
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Διαχείριση Κατηγοριών</h2>
      <ul className="space-y-4 mb-4">
        {categories.map((category, index) => (
          <li key={category.id} className="flex items-center space-x-2">
            {editingIndex === index ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave(index)}
                autoFocus
                className="flex-grow"
              />
            ) : (
              <span className="flex-grow">{category.category}</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(index, category.category)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Επεξεργασία</span>
            </Button>
            <div className="w-64">
              <label htmlFor={`officer-${category.id}`} className="sr-only">
                Ανάθεση σε υπάλληλο:
              </label>
              <select
                id={`officer-${category.id}`}
                value={category.officer_id || ''}
                onChange={(e) => handleOfficerChange(category.id, e.target.value || null)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                disabled={isOfficersLoading}
              >
                <option value="">Επιλέξτε έναν υπάλληλο</option>
                {officers.map(officer => (
                  <option key={officer.id} value={officer.id}>
                    {officer.full_name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(index)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Διαγραφή</span>
            </Button>
          </li>
        ))}
      </ul>
      <div className="space-y-2">
        <Button onClick={handleAdd} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Προσθήκη Κατηγορίας
        </Button>
        <Button onClick={handleSaveChanges} className="w-full">
          <Save className="h-4 w-4 mr-2" /> Αποθήκευση αλλαγών
        </Button>
      </div>
    </div>
  )
}