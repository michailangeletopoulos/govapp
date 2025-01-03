"use client";

import { useState } from 'react'
import { createClient } from "@/utils/supabase/client";
import { UUID } from 'crypto';

type Form = {
    id: number;
    full_name: string;
    patronym: string;
    email: string;
    phone: number;
    number_id: string;
    comments: string;
    formTitle: string;
    officer_id: UUID;
    answer: string;
    done: boolean;
};

type Officer = {
    id: string;
    full_name: string;
}

export default function AdminFormList({ forms, officers }: { forms: Form[], officers: Officer[] }) {
  const [assignedForms, setAssignedForms] = useState<{ [key: number]: string | null }>({})
  const supabase = createClient();

  const handleAssignOfficer = async (formId: number, officerId: string | null) => {
    const { error } = await supabase
      .from('users_forms')
      .update({ officer_id: officerId })
      .eq('id', formId)

    if (error) {
      console.error('Error assigning officer:', error)
      return
    }

    setAssignedForms(prev => ({ ...prev, [formId]: officerId }))
  }

  return (
    <div className="space-y-4">
      {forms.map(form => (
        <div key={form.id} className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold">{form.formTitle}</h2>
          <p>Submitted by: {form.full_name}</p>
          <p>Email: {form.email}</p>
          <p>Phone: {form.phone}</p>
          <p>Comments: {form.comments}</p>
          <div className="mt-2">
            <label htmlFor={`officer-${form.id}`} className="block text-sm font-medium text-gray-700">
              Assign to Officer:
            </label>
            <select
              id={`officer-${form.id}`}
              value={assignedForms[form.id] || ''}
              onChange={(e) => handleAssignOfficer(form.id, e.target.value || null)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select an officer</option>
              {officers.map(officer => (
                <option key={officer.id} value={officer.id}>
                  {officer.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}