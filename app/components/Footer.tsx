"use client";

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button"

type Category = {
  id: number
  category: string
}


const Footer = () => {

  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClient();

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('id, category')
        .limit(5)

      if (error) {
        console.error('Error fetching categories:', error)
      } else {
        setCategories(data || [])
      }
    }

    fetchCategories()
  }, [supabase])


  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/infi_gray.png"
              alt="GOV.GR Logo"
              width={120}
              height={40}
              className="mb-4"
            />
            <p className="text-sm text-gray-600 text-center md:text-left">
              Ψηφιοποιήστε τα στοιχεία σας με ασφάλεια και ευκολία.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center md:text-left">Δημοφιλείς Κατηγορίες</h3>
            <ul className="space-y-2 text-center md:text-left">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/categories`} className="text-blue-600 hover:underline">
                    {category.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Επικοινωνία</h3>
            <Button variant="outline" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>contact@gov.gr</span>
            </Button>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} GOV.GR. Όλα τα δικαιώματα διατηρούνται.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer