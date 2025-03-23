import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from 'lucide-react'

type FormField = {
  id: string;
  label: string;
  type: 'text' | 'file' | 'date';
  example: string;
  info: string;
}

type FormPreviewProps = {
  title: string;
  fields: FormField[];
  context: string;
}

const FormPreview: React.FC<FormPreviewProps> = ({ title, fields, context }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title || 'Όψη φόρμας προς τον χρήστη'}</CardTitle>
      </CardHeader>
      <CardContent>
        {context && (
          <div 
            className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: context }}
          />
        )}
        {fields.map((field) => (
          <div key={field.id} className="mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <Label htmlFor={field.id}>{field.label}</Label>
              {field.info && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{field.info}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {field.type === 'text' ? (
              <Input
                id={field.id}
                placeholder={field.example || `Πληκτρολογήστε ${field.label.toLowerCase()}`}
              />
            ) : field.type === "file" ? (
              <Input
                id={field.id}
                type="file"
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            ) : (
              <Input id={field.id} type="date" placeholder={field.example || `Επιλέξτε ημερομηνία`} />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FormPreview;

