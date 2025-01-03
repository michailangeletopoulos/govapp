import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Form = {
  id: number
  formTitle: string
  full_name: string
  patronym: string
  email: string
  phone: string
  number_id: string
  comments: string
  date: string
  done: boolean
  file_urls: string[]
}

export default function FormDetails({ form }: { form: Form }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.formTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-2 text-sm">
          <div>
            <dt className="font-medium">Ονοματεπώνυμο:</dt>
            <dd>{form.full_name}</dd>
          </div>
          <div>
            <dt className="font-medium">Πατρώνυμο:</dt>
            <dd>{form.patronym}</dd>
          </div>
          <div>
            <dt className="font-medium">Email:</dt>
            <dd>{form.email}</dd>
          </div>
          <div>
            <dt className="font-medium">Τηλέφωνο:</dt>
            <dd>{form.phone}</dd>
          </div>
          <div>
            <dt className="font-medium">Αριθμός Ταυτότητας:</dt>
            <dd>{form.number_id}</dd>
          </div>
          <div>
            <dt className="font-medium">Σχόλια:</dt>
            <dd>{form.comments}</dd>
          </div>
          <div>
            <dt className="font-medium">Ημερομηνία Υποβολής:</dt>
            <dd>{new Date(form.date).toLocaleDateString('el-GR')}</dd>
          </div>
          <div>
            <dt className="font-medium">Κατάσταση:</dt>
            <dd>{form.done ? 'Completed' : 'In Progress'}</dd>
          </div>
          <div>
            <dt className="font-medium">Κατατεθειμένα Αρχεία:</dt>
            <dd>
              <ul className="list-disc list-inside">
                {form.file_urls.map((url, index) => (
                  <li key={index}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Αρχείο {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}