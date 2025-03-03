"use client";

import React, { useEffect, useState } from 'react'
import { getCategories, getTitleForm } from "../user_details/getProfile"
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Categories = {
    id: number;
    category: string;
}

type Form = {
    id: number;
    title: string;
    context: string;
}

export default function Page() {
  const router = useRouter();

  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [titleForms, setTitleForms] = useState<Record<string, Form[]>>({});
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const categories = await getCategories();
    setCategories(categories || []);
  };

  const fetchTitleForms = async (category: string) => {
    if (!titleForms[category]) {
      const titles = await getTitleForm(category);
      setTitleForms(prev => ({ ...prev, [category]: titles || [] }));
    }
    setSelectedCategory(category);
  };

  const goToFormPage = (titleId: number) => {
    setIsDialogOpen(false);
    router.push(`./forms/${titleId}`);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="md:col-span-1 space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => fetchTitleForms(category.category)}
              className={cn(
                "w-full text-left px-4 py-2 rounded-lg transition-colors",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200",
                selectedCategory === category.category && "bg-blue-50 text-blue-700 font-medium"
              )}
            >
              {category.category}
            </button>
          ))}
        </div>

        
        <div className="md:col-span-3">
          {!selectedCategory ? (
            <div className="flex h-full items-center justify-center text-gray-500 text-lg">
              Πατήστε πάνω σε μια κατηγορία για να δείτε τα διαθέσιμα αιτήματα της
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6">{selectedCategory}</h1>
              {titleForms[selectedCategory]?.length === 0 ? (
                <div className="text-gray-500 text-lg">
                  Δεν υπάρχει διάθεσιμο αίτημα γι αυτήν την κατηγορία προς το παρόν
                </div>
              ) : (
                <div className="space-y-4">
                  {titleForms[selectedCategory]?.map((form) => (
                    <div key={form.id}>
                      <Dialog open={isDialogOpen && selectedForm?.id === form.id} 
                             onOpenChange={(open) => {
                               if (!open) setSelectedForm(null);
                               setIsDialogOpen(open);
                             }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left hover:bg-gray-50 p-4 rounded-lg"
                            onClick={() => setSelectedForm(form)}
                          >
                            {form.title}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{form.title}</DialogTitle>
                          <DialogDescription>
                            Περιγραφή
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4" dangerouslySetInnerHTML={{ __html: form.context}}>     
                        </div>
                          <DialogFooter>
                            <Button onClick={() => goToFormPage(form.id)}>
                              Μετάβαση στη φόρμα
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

