"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { createClient } from "@/utils/supabase/client";
import { UUID } from 'crypto';

//type FormData = Database['public']['Tables']['form']['Row']
//type UserFormData = Database['public']['Tables']['users_forms']['Row']

type FormData = {
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

async function getData() {
  const supabase = createClient();

  const { data: forms, error: formsError } = await supabase
    .from('form')
    .select('*')

  const { data: userForms, error: userFormsError } = await supabase
    .from('users_forms')
    .select('formTitle')

  if (formsError || userFormsError) {
    console.error('Error fetching data:', formsError || userFormsError)
    return { categoryData: [], formData: [] }
  }

  // Process data for category chart
  const categoryCount = forms.reduce((acc, form) => {
    acc[form.category] = (acc[form.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categoryData = Object.entries(categoryCount).map(([category, count]) => ({
    category,
    count
  }))

  // Process data for form title chart
  const formCount = userForms.reduce((acc, userForm) => {
    acc[userForm.formTitle] = (acc[userForm.formTitle] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const formData = Object.entries(formCount).map(([title, count]) => ({
    title,
    count
  }))

  return { categoryData, formData }
}

export default async function FormAnalytics() {
  const { categoryData, formData } = await getData()

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Form Submissions by Category</CardTitle>
          <CardDescription>Number of forms in each category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Number of Forms",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Submissions by Title</CardTitle>
          <CardDescription>Number of submissions for each form</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Number of Submissions",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="title" type="category" width={150} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}