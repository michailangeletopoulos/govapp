import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://sxglystijlgwclrgduoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Z2x5c3Rpamxnd2NscmdkdW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE1NTY3NDksImV4cCI6MjAyNzEzMjc0OX0.jRmuV2p9gdiwKwvcqwjLb1lQ8a9o9BNLeZODbB2qEsA';
const supabase = createClient(supabaseUrl, supabaseKey);


export default function Login({
  searchParams,
  }: {
    searchParams: { message: string };
  }) {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      "use server"
      event.preventDefault();
      

      const formData = new FormData(event.currentTarget);
  
      const email = formData.get("email") as string;
      const name = formData.get("name") as string;
      const surname = formData.get("surname") as string;
      const address = formData.get("address") as string;
      const imageFile = formData.get('filename') as File;
      if (imageFile) {
      const { data, error } = await supabase.storage
      .from('Example')
      .upload('images/' + imageFile.name, imageFile);
  
      if (error) {
        throw new Error('Error uploading image: ' + error.message);
      }

      /* const imageUrl = supabase.storage.from('images').getPublicUrl(`public/${imageFile.name}`) */
      const imageUrl = data?.path ? `${supabaseUrl}/storage/v1/object/public/${data.path}` : '';


      const { data: insertedData, error: insertError } = await supabase
        .from('user_data') // Replace 'your_table_name' with your actual table name
        .insert([
          { name: name, surname: surname, email: email, address: address, image_url: imageUrl },
        ])
        .select();

      if (insertError) {
        throw new Error('Error inserting data: ' + insertError.message);
      }

      console.log('Data inserted successfully:', insertedData);
    } else {
      throw new Error('No image selected');
    }
    
    
  };
  
    const signUp = async (formData: FormData) => {
      "use server";
  
      const origin = headers().get("origin");
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      
  
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
  
      if (error) {
        return redirect("/login?message=Could not authenticate user");
      }
  
      return redirect("/login?message=Check email to continue sign in process");
    };
  
    return (
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
        <Link
          href="/"
          className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>
  
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground" onSubmit={handleSubmit}>
          <label className="text-md" htmlFor="password">
            Name
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="name"
            placeholder="Name"
            required
          />
          <label className="text-md" htmlFor="password">
            Surname
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="surname"
            placeholder="Surname"
            required
          />
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Adress
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="address"
            placeholder="Adress"
            required
          />
          <label className="text-md" htmlFor="image">
            Fotografia
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="file"
            name="filename"
            placeholder="image"
            required
          />

        <button type="submit" className="rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
          Submit
        </button>
        {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        
        </form>
      </div>
    );
  }
  