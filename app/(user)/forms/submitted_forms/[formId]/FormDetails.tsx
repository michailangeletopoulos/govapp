"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UUID } from "crypto"
import Image from 'next/image'
import { useState } from "react"
import ChatComponent from "./ChatComponent"

type FormField = {
  id: string
  label: string
  type: string
  info?: string
  example?: string
}

type Form = {
  id: string
  formTitle: string
  form_data: { [key: string]: string | number }
  created_at: string
  user_id: string
  officer_id: string | null
  fields: FormField[]
}

export default function FormDetails({ form, userId }: { form: Form, userId: string }) {

  const [isChatOpen, setIsChatOpen] = useState(false)

  if (!form || !form.fields) {
    return <Card><CardContent>No form data available</CardContent></Card>;
  }
  return (
    <div
      className={`flex transition-all duration-300 ease-in-out ${isChatOpen ? "justify-between" : "justify-center"}`}
    >
    <div
      className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out ${isChatOpen ? "w-1/2" : "w-full max-w-2xl"}`}
    >
    
    <Card>
      <CardHeader>
        <CardTitle>{form.formTitle}</CardTitle>
      </CardHeader>
      <CardContent>
      
        <dl className="grid grid-cols-1 gap-4 text-sm">
          {form.fields.map((field) => {
            const value = form.form_data[field.id] ?? "N/A";
            return (
              <div key={field.id}>
                <dt className="font-medium">{field.label}:</dt>
                <dd>
                  {field.type === 'file' && typeof value === 'string' ? (
                    <a 
                      href={value} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      {field.type === 'file' && value.toLowerCase().endsWith('.png') ? (
                        <div className="mt-2">
                          <Image src={value || "/placeholder.svg"} alt={field.label} width={200} height={200} />
                        </div>
                      ) : (
                        'Άνοιγμα αρχείου'
                      )}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
                {field.info && (
                  <dd className="text-gray-500 text-xs mt-1">{field.info}</dd>
                )}
              </div>
            )
          })}
          
          <div>
            <dt className="font-medium">Ημερομηνία Υποβολής:</dt>
            <dd>{new Date(form.created_at).toLocaleDateString('el-GR')}</dd>
          </div>
          
        </dl>
        <Button onClick={() => setIsChatOpen(!isChatOpen)} className="mt-4">
          {isChatOpen ? "Κλείσιμο επικοινωνιών" : "Ενδιάμεσες επικοινωνίες"}
        </Button>
        
      </CardContent>
    </Card>
    </div>
    <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isChatOpen ? "w-1/2 opacity-100" : "w-0 opacity-0"
        }`}
      >
        {isChatOpen && <ChatComponent formId={form.id} userId={userId} />}
      </div>
    </div>
  )
}

