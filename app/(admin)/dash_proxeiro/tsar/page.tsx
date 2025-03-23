"use client";

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { createClient } from "@/utils/supabase/client"
import type { UUID } from "crypto"
import { useRouter } from "next/navigation"
import { getProfileRole } from "@/app/(user)/user_details/getProfile";

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
  officerMonthlyData: {
    officer_name: string
    month: string
    completed: number
    pending: number
  }[]
  categoryStatusData: {
    category: string
    completed: number
    pending: number
  }[]
}

type Officer = {
  id: UUID
  full_name: string
}

function FormAnalytics() {
  const [chartData, setChartData] = useState<ChartData>({
    categoryData: [],
    formData: [],
    officerMonthlyData: [],
    categoryStatusData: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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

        // Ανάκτηση δεδομένων υπαλλήλων
        const { data: officers, error: officersError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("role", "officer")

        if (officersError) {
          throw new Error(officersError.message || "Error fetching officers")
        }

        // Υπολογισμός 3 τελευταίων μηνών
        const currentDate = new Date()
        const months = []
        for (let i = 0; i < 3; i++) {
          const monthDate = new Date(currentDate)
          monthDate.setMonth(currentDate.getMonth() - i)
          months.push({
            month: monthDate.toLocaleString("default", { month: "short", year: "numeric" }),
            year: monthDate.getFullYear(),
            monthNum: monthDate.getMonth() + 1,
          })
        }

        // Ανάκτηση δεδομένων για τους 3 τελευταίους μήνες
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

        const { data: recentSubmissions, error: submissionsError } = await supabase
          .from("user_form_submissions")
          .select("officer_id, created_at, done, formTitle")
          .gte("created_at", threeMonthsAgo.toISOString())

        if (submissionsError) {
          throw new Error(submissionsError.message || "Error fetching submissions")
        }

        // Υπολογισμός υπαλλήλων για τους 3 τελευταίους μήνες
        const officerMonthlyData = []

        for (const officer of officers || []) {
          for (const monthData of months) {
            const officerSubmissions =
              recentSubmissions?.filter((submission) => {
                const submissionDate = new Date(submission.created_at)
                return (
                  submission.officer_id === officer.id &&
                  submissionDate.getMonth() + 1 === monthData.monthNum &&
                  submissionDate.getFullYear() === monthData.year
                )
              }) || []

            const completed = officerSubmissions.filter((s) => s.done).length
            const pending = officerSubmissions.filter((s) => !s.done).length

            officerMonthlyData.push({
              officer_name: officer.full_name,
              month: monthData.month,
              completed,
              pending,
            })
          }
        }

        const { data: allSubmissions, error: allSubmissionsError } = await supabase
          .from("user_form_submissions")
          .select("formTitle, done")

        if (allSubmissionsError) {
          throw new Error(allSubmissionsError.message || "Error fetching all submissions")
        }

        const formTitleToCategory: Record<string, string> = {}
        forms.forEach((form) => {
          if (form.title && form.category) {
            formTitleToCategory[form.title] = form.category
          }
        })

        const categoryStatusMap: Record<string, { completed: number; pending: number }> = {}

        allSubmissions?.forEach((submission) => {
          const category = formTitleToCategory[submission.formTitle]
          if (category) {
            if (!categoryStatusMap[category]) {
              categoryStatusMap[category] = { completed: 0, pending: 0 }
            }

            if (submission.done) {
              categoryStatusMap[category].completed += 1
            } else {
              categoryStatusMap[category].pending += 1
            }
          }
        })

        const categoryStatusData = Object.entries(categoryStatusMap).map(([category, stats]) => ({
          category,
          completed: stats.completed,
          pending: stats.pending,
        }))

        setChartData({ categoryData, formData, officerMonthlyData, categoryStatusData })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error")
      } finally {
        setIsLoading(false)
      }
    }
    isUserLog()
    fetchData()
  }, [])

  const isUserLog = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login?need_logIn=true")
    }

    const role = await getProfileRole();
        
    console.log(role);
        
    if (role != "admin") {
     router.push("./");
    }

  }

  if (isLoading) {
    return <div>Φόρτωση...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const officerData = chartData.officerMonthlyData.reduce(
    (acc, item) => {
      if (!acc[item.officer_name]) {
        acc[item.officer_name] = {}
      }

      if (!acc[item.officer_name][item.month]) {
        acc[item.officer_name][item.month] = {
          completed: 0,
          pending: 0,
        }
      }

      acc[item.officer_name][item.month].completed = item.completed
      acc[item.officer_name][item.month].pending = item.pending

      return acc
    },
    {} as Record<string, Record<string, { completed: number; pending: number }>>,
  )

  const monthSet = new Set<string>()
  chartData.officerMonthlyData.forEach((item) => {
    monthSet.add(item.month)
  })
  const uniqueMonths = Array.from(monthSet)

  const formattedOfficerData = Object.entries(officerData).map(([officer, monthData]) => {
    const result: any = { officer_name: officer }

    uniqueMonths.forEach((month) => {
      if (monthData[month]) {
        result[`${month}_completed`] = monthData[month].completed
        result[`${month}_pending`] = monthData[month].pending
      } else {
        result[`${month}_completed`] = 0
        result[`${month}_pending`] = 0
      }
    })

    return result
  })

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
          <CardDescription>Ο αριθμός των φορών που έχει υποβληθεί μια φόρμα</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Φορές που έχει υποβληθεί",
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

      <Card>
        <CardHeader>
          <CardTitle>Κατάσταση Φορμών ανά Κατηγορία</CardTitle>
          <CardDescription>Ολοκληρωμένες και εκκρεμείς φόρμες ανά κατηγορία</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              completed: {
                label: "Ολοκληρωμένες",
                color: "hsl(var(--chart-1))",
              },
              pending: {
                label: "Εκκρεμείς",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.categoryStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#4CAF50" name="Ολοκληρωμένες" />
                <Bar dataKey="pending" fill="#FF5722" name="Εκκρεμείς" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Απόδοση Υπαλλήλων ανά Μήνα</CardTitle>
          <CardDescription>Ολοκληρωμένες και εκκρεμείς φόρμες ανά υπάλληλο τους τελευταίους 3 μήνες</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              completed: {
                label: "Ολοκληρωμένες",
                color: "hsl(var(--chart-1))",
              },
              pending: {
                label: "Εκκρεμείς",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[500px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedOfficerData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="officer_name" type="category" width={150} />
                <Tooltip
                  formatter={(value, name) => {
                    if (typeof name === "string") {
                      if (name.includes("completed")) {
                        return [`${value} φόρμες`, "Ολοκληρωμένες"]
                      } else if (name.includes("pending")) {
                        return [`${value} φόρμες`, "Εκκρεμείς"]
                      }
                    }
                    return [value, name]
                  }}
                  labelFormatter={(label) => `Υπάλληλος: ${label}`}
                />
                <Legend />
                {uniqueMonths.map((month, index) => (
                  <React.Fragment key={month}>
                    <Bar
                      dataKey={`${month}_completed`}
                      stackId={month}
                      fill={`hsl(${120 + index * 40}, 70%, 50%)`}
                      name={`${month} - Ολοκληρωμένες`}
                    />
                    <Bar
                      dataKey={`${month}_pending`}
                      stackId={month}
                      fill={`hsl(${0 + index * 40}, 70%, 50%)`}
                      name={`${month} - Εκκρεμείς`}
                    />
                  </React.Fragment>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default FormAnalytics

