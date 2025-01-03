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

export default function OfficerFormList({ forms }: { forms: Form[] }) {
  const [updatedForms, setUpdatedForms] = useState<{ [key: number]: Partial<Form> }>({})
  const supabase = createClient();

  const handleUpdateForm = async (formId: number) => {
    const updatedForm = updatedForms[formId]
    if (!updatedForm) return

    const { error } = await supabase
      .from('users_forms')
      .update(updatedForm)
      .eq('id', formId)

    if (error) {
      console.error('Error updating form:', error)
      return
    }

    // Clear the local state for this form
    setUpdatedForms(prev => {
      const newState = { ...prev }
      delete newState[formId]
      return newState
    })
  }

  const handleInputChange = (formId: number, field: keyof Form, value: string | boolean) => {
    setUpdatedForms(prev => ({
      ...prev,
      [formId]: { ...prev[formId], [field]: value }
    }))
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
            <label htmlFor={`answer-${form.id}`} className="block text-sm font-medium text-gray-700">
              Answer:
            </label>
            <textarea
              id={`answer-${form.id}`}
              value={updatedForms[form.id]?.answer ?? form.answer ?? ''}
              onChange={(e) => handleInputChange(form.id, 'answer', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
            />
          </div>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={updatedForms[form.id]?.done ?? form.done}
                onChange={(e) => handleInputChange(form.id, 'done', e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Mark as done</span>
            </label>
          </div>
          <button
            onClick={() => handleUpdateForm(form.id)}
            className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Form
          </button>
        </div>
      ))}
    </div>
  )
}