"use client";

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { createClient } from "@/utils/supabase/client"
import type { UUID } from "crypto"

type FormData = {
  id: number
  full_name: string
  patronym: string
  email: string
  phone: number
  number_id: string
  comments: string
  formTitle: string
  officer_id: UUID
  answer: string
  done: boolean
}

type ChartData = {
  categoryData: { category: string; count: number }[]
  formData: { title: string; count: number }[]
}

function FormAnalytics() {
  const [chartData, setChartData] = useState<ChartData>({ categoryData: [], formData: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient()

        const { data: forms, error: formsError } = await supabase.from("form").select("*")

        const { data: userForms, error: userFormsError } = await supabase
          .from("user_form_submissions")
          .select("formTitle")

        if (formsError || userFormsError) {
          throw new Error(formsError?.message || userFormsError?.message || "Error φορμών")
        }

        if (!forms || !userForms) {
          throw new Error("Δεν βρέθηκαν στοιχεία")
        }

        // Process data for category chart
        const categoryCount = forms.reduce<Record<string, number>>((acc, form) => {
          if (typeof form.category === "string") {
            acc[form.category] = (acc[form.category] || 0) + 1
          }
          return acc
        }, {})

        const categoryData = Object.entries(categoryCount).map(([category, count]) => ({
          category,
          count: count as number,
        }))

        // Process data for form title chart
        const formCount = userForms.reduce<Record<string, number>>((acc, userForm) => {
          if (typeof userForm.formTitle === "string") {
            acc[userForm.formTitle] = (acc[userForm.formTitle] || 0) + 1
          }
          return acc
        }, {})

        const formData = Object.entries(formCount).map(([title, count]) => ({
          title,
          count: count as number,
        }))

        setChartData({ categoryData, formData })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Φόρτωση...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Φόρμες των Κατηγοριών</CardTitle>
          <CardDescription>Ο αριθμός των φορμών που έχει κάθε κατηγορία</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Αριθμός Φορμών",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.categoryData}>
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
          <CardTitle>Υποβληθείσες φόρμες</CardTitle>
          <CardDescription>Ο αριθμός που έχει υποβληθεί μια κατηγορία</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Φορές που έχουν υποβληθεί",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.formData} layout="vertical">
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

export default FormAnalytics

