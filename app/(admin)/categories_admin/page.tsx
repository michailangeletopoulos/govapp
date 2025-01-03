"use client";

import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, Save, Check, ChevronsUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
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
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
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
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
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
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
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
        toast.success('New category added successfully')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Failed to add category')
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
      toast.success(validOfficerId ? 'Officer assigned successfully' : 'Officer unassigned successfully')
    } catch (error) {
      console.error('Error assigning officer:', error)
      toast.error('Failed to assign officer')
    }
  }

  const handleSaveChanges = async () => {
    toast.success('All changes are already saved')
  }

  if (isLoading) {
    return <div className="text-center mt-10">Loading categories...</div>
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Category Manager</h2>
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
              <span className="sr-only">Edit</span>
            </Button>
            <div className="w-64">
              <label htmlFor={`officer-${category.id}`} className="sr-only">
                Assign to Officer:
              </label>
              <select
                id={`officer-${category.id}`}
                value={category.officer_id || ''}
                onChange={(e) => handleOfficerChange(category.id, e.target.value || null)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                disabled={isOfficersLoading}
              >
                <option value="">Select an officer</option>
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
              <span className="sr-only">Delete</span>
            </Button>
          </li>
        ))}
      </ul>
      <div className="space-y-2">
        <Button onClick={handleAdd} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
        <Button onClick={handleSaveChanges} className="w-full">
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  )
}