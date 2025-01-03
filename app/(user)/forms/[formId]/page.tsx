"use client";

import React , {useEffect, useState} from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCurrentProfile, getFormDetails, getTitleFormById, insertUserForm, uploadFilesToSupabase } from '../../user_details/getProfile';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import FileUpload from '../FileUpload';

interface formPageProps {
    params: {formId: number};
} 

type Form = {
  title: string;
  context: string;
}

const formSchema = z.object({
  full_name: z.string().min(2).max(50),
  patronym: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.coerce.number().int(),
  //phone: z.string().transform((val) => parseInt(val,10)),
  number_id: z.string().min(2).max(50),
  comments: z.string().min(2).max(999),
  files: z.array(z.instanceof(File)).optional(),
})

export default function formPage({
    params: {formId}
}: formPageProps ) {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  
  useEffect(() => {
    getForm()
  }, [])
  
  const getForm = async () => {
    const form = await getFormDetails(formId);
    setForm(form || null);
  } 

  const formForUser = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {

      full_name: "",
      patronym: "",
      email: "",
      phone: 0,
      number_id: "",
      comments: "",
      files: []
    }, 
    
  })

  const { setValue } = formForUser;
  useEffect(() => {
    const fetchUserData = async () => {
        const userData = await getCurrentProfile(); // Fetch user data

        // Update form default values dynamically
        setValue('full_name', userData?.full_name || '');
        setValue('patronym', userData?.patronym || '');
        setValue('email', userData?.email || '');
        setValue('phone', userData?.phone || '');
        setValue('number_id', userData?.number_id || '');

        setLoading(false); // Stop loading once data is fetched
    };

    fetchUserData();
  }, [setValue]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  async function onSubmit(values: z.infer<typeof formSchema>, e: React.FormEvent) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    e.preventDefault()
    const formTitle = await getTitleFormById(formId);

    const fileURLs = await uploadFilesToSupabase(files);

    insertUserForm(values.full_name, values.patronym, values.email, values.phone,
      values.number_id, values.comments, form ? form.title : 'null', fileURLs
    );


    
  }


  const goToCategoriesPage = ()=> {
    router.push("../categories");
  }

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>{form ? form.title : 'Loading...'} </CardTitle>
        <CardDescription>Περιγραφή</CardDescription>
      </CardHeader> 
      <CardContent>
        <p>
          {form ? form.context : 'Loading...'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => goToCategoriesPage()}>Cancel</Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Υποβολή</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[540px] sm:max-w-full">
            <SheetHeader className="mb-6">
              <SheetTitle>Υποβολή Φόρμας</SheetTitle>
              <SheetDescription>
                Συμπλήρωσε ή τροποποίησε τα στοιχεία σου 
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col space-y-4 h-[calc(100vh-10rem)] overflow-y-auto pr-4" aria-label="Form fields">
              <Form {...formForUser}>
              <form className="space-y-6" onSubmit={formForUser.handleSubmit((data, e) => onSubmit(data, e as any))}>
                <FormField
              control={formForUser.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Ονοματεπώνυμο</FormLabel>
                  <FormControl>
                    <Input placeholder="πχ Μιχάλης Αγγελετόπουλος" {...formForUser.register('full_name')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                  <FormField
              control={formForUser.control}
              name="patronym"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Πατρώνυμο</FormLabel>
                  <FormControl>
                    <Input placeholder="πχ Παναγιώτης" {...formForUser.register('patronym')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                  <FormField
              control={formForUser.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="πχ example@gmail.com" {...formForUser.register('email')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                  <FormField
              control={formForUser.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Τηλέφωνο</FormLabel>
                  <FormControl>
                    <Input placeholder="πχ 6912345678" {...formForUser.register('phone')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                  <FormField
              control={formForUser.control}
              name="number_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Αριθμός Ταυτότητας</FormLabel>
                  <FormControl>
                    <Input placeholder="πχ ΑΨ 1234" {...formForUser.register('number_id')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                <FormField
              control={formForUser.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Σχόλια</FormLabel>
                  <FormControl>
                    <Input {...formForUser.register('comments')} />
                  </FormControl>
                  <FormDescription>
                    Γράψτε τα σχόλια που έχετε για την αίτηση σας
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
                <FileUpload files={files} setFiles={setFiles} />
              </form>
              </Form>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={(e) => formForUser.handleSubmit((data) => onSubmit(data, e))(e)}>Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  )
}
