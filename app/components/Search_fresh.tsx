"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Form {
    id: number
    category: string
    title: string
    context: string
  }
  
  export function FormSearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Form[]>([])
  const supabase = createClient();

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("form")
        .select("id, category, title, context")
        .ilike("title", `%${searchTerm}%`); //αναζητηση

      if (error) {
        console.error("Error fetching forms:", error);
        return;
      }

      setResults(data);
    };

    fetchResults();
  }, [searchTerm]); 
    
  return (
    <section className="max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row bg-sky-500">
        <div className='relative z-20 flex flex-1 flex-col xl:w-1/2'>
          <h1 className='text-4xl font-bold lg:text-6xl xl:text-7xl'>GOV.GR</h1>
          <p className='mt-6 text-base text-gray-700 xl:max-w-[520px]'>Ψηφιοποιήσε τα στοιχεία σου</p>
    <div className='mt-8 w-full max-w-[500px] relative'>
      <h1 className="text-2xl font-bold mb-4">Αναζήτηση</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Αναζητήστε με βάση τον τίτλο της φόρμας"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      
        <ul className="space-y-4">
          {results.map((form) => (
            <li key={form.id} className="p-4 border rounded-md">
              <Link href={`./forms/${form.id}`} legacyBehavior>
                <a className="text-lg font-semibold text-black hover:underline">{form.title}</a>
              </Link>
              <p className="text-sm text-gray-600"><strong>Κατηγορία:</strong> {form.category}</p>
            </li>
          ))}
        </ul>
      
    
    </div>
    </div>
    </section>
  );
    
  }