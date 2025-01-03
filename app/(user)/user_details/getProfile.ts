//"use server";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";


export async function getCurrentProfile() {
    const supabase = createClient();
/*
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        console.log("User is not authenticated or data is unavailable.");
        redirect("/");  
    }
   */
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      redirect('/login')
    } 
    else {
      const { data: userDetails, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, patronym, email, phone, number_id')
      .eq('id', data.user.id)
      .single(); //giati perimeno 1 row

      const userData = { id: userDetails?.id, full_name: userDetails?.full_name, role: userDetails?.role,patronym: userDetails?.patronym, 
        email: userDetails?.email, phone: userDetails?.phone, number_id: userDetails?.number_id}
  
      console.log(userData);

      return userData;
    }
}

export async function updateCurrentProfile(name: string, patronym: string, email: string, phone: number, number_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  } 
  else {
  const { data: userDetails, error } = await supabase
  .from('profiles')
  .update({ full_name: name, patronym: patronym, email: email, phone: phone, number_id: number_id})
  .eq('id', data.user.id)
  .select()
  }
}

export async function getProfileRole() {
  var role;

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    role = "user";
  }
  else {
    const { data: userDetails, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', data.user.id)
      .single();
    
    if (userDetails?.role == "admin") {
      role = "admin";
    }
    else if (userDetails?.role == "user") {
      role = "user";
    }
  } 
  return role;
}

export async function getAllProfiles() {
  const supabase = createClient();
  
  const { data: profiles, error } = await supabase
  .from('profiles')
  .select('full_name, role, email')
       
  if (error) {
    console.error(error);
    return []; 
  } 

  return profiles;
} 

// Functions for categories and forms

export async function getCategories(){
  const supabase = createClient();
  
const { data: category, error } = await supabase
.from('categories')
.select('*')

  if (error) {
    console.error(error);
    return []; 
  } 

  console.log(category)

  return category;
}

export async function getTitleForm(category: string) {
  const supabase = createClient();
  const { data: titles, error } = await supabase
  .from('form')
  .select('id, title, context')
  .eq('category', category) 

  if (error) {
    console.error(error);
    return []; 
  } 

  console.log(titles)

  return titles;
}

export async function getFormDetails(formId: number) {
  const supabase = createClient();
  const { data: form, error } = await supabase
  .from('form')
  .select('title, context')
  .eq('id', formId) 
  .single()

  if (error) {
    console.error(error);
    return null; 
  } 

  console.log(form)

  return form;
}

export async function insertUserForm(full_name: string, patronym: string, email: string, phone: number, number_id: string, comments: string, formTitle:string, 
  fileURLs: string[]
) {
  const supabase = createClient();

  const { data:categoryData, error: categoryError } = await supabase
  .from('form')
  .select('category')
  .eq('title', formTitle)
  console.log(categoryData)
  if (categoryError || !categoryData || categoryData.length === 0) {
    console.error('Error fetching category:', categoryError);
    return;
  }

  const category = categoryData[0].category;

  const { data: officerData, error: officerError} = await supabase 
  .from('categories')
  .select('officer_id')
  .eq('category', category)

  console.log(officerData)

  if (officerError || !officerData || officerData.length === 0) {
    console.error('Error fetching officer_id:', officerError);
    return;
  }

  const officer_id = officerData[0].officer_id;
  console.log('Officer ID:', officer_id); 
  
  const { data, error } = await supabase
  .from('users_forms')
  .insert([
    { full_name: full_name, patronym: patronym , email: email, phone: phone , number_id: number_id, comments: comments, formTitle: formTitle, officer_id: officer_id, done: false, 
      file_urls: fileURLs
    }
  ])
  .select()

  if (error) {
    console.error(error);
  } 
  else {
    console.error(data);
  } 
  
}

export async function getTitleFormById(titleId: number) {
  const supabase = createClient();

  const { data: title, error } = await supabase
  .from('form')
  .select('title')
  .eq('id', titleId) 
  .single()

  if (error) {
    console.error(error);
    return null; 
  } 

  console.log(title)

  return title;

}

export async function uploadFilesToSupabase(files: File[]) {
  const supabase = createClient();

  const uploadedFileURLs: string[] = [];
  for (const file of files) {
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(`${file.name}`, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      continue; // Skip the rest if an upload error occurs
    }

    // Get the public URL after successful upload
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(`${file.name}`);

    // Push the public URL to the array if it exists
    if (data?.publicUrl) {
      uploadedFileURLs.push(data.publicUrl);
    }
  }

  return uploadedFileURLs;
};

export async function getOfficers() {
  const supabase = createClient();
  const { data, error } = await supabase
  .from('profiles')
  .select('id, full_name')
  .eq('role', 'officer')

  if (error) {
    console.error(error);
    return []; 
  } 
  console.log(data);

  return data;
}

export async function updateRole(userEmail: string, newRole: string) {
  const supabase = createClient();

  const { error } = await supabase
  .from('profiles')
  .update({ role: newRole })
  .eq('email', userEmail);
  console.log("1");

  if (error) {
    console.error(error);
    console.log("2");
    return []; 
  } 

}