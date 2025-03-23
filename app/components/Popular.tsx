"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from "@/utils/supabase/client";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

interface Form {
    id: number
    title: string
}

const Popular = () => {
  const [forms, setForms] = useState<Form[]>([])
  const supabase = createClient();

  useEffect(() => {
    const fetchForms = async () => {
      const { data, error } = await supabase
        .from('form')
        .select('id, title')
        .limit(9)

      if (error) {
        console.error('Error fetching forms:', error)
      } else {
        setForms(data || [])
      }
    }

    fetchForms()
  }, [supabase])
  
  return (
    <section className="max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row" >
        <h1 className='bold-22 lg:bold-58' >Δημοφιλή Αιτήματα</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 md:mt-0'>
        {forms.map((form) => (
          <Link href={`/forms/${form.id}`} key={form.id} className="relative flex items-center group">
            <ArrowRightAltIcon className="mr-2 h-5 w-5" />
            <h3 className='underline group-hover:text-gray-900 transition-colors'>{form.title}</h3>
          </Link>
        ))}
      </div>

    </section>

  )
}

export default Popular