import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCurrentProfile() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return null;
  } 
  else {
    const { data: userDetails, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, patronym, email, phone, number_id')
    .eq('id', data.user.id)
    .single(); //γιατί περιμένω 1 row

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
    console.log("edo");
    role = "user";
  }
  else {
    console.log("sadxzc");
    const { data: userDetails, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', data.user.id)
      .single();
    
    if (userDetails?.role == "admin") {
      role = "admin";
    }
    else if (userDetails?.role == "officer") {
      role = "officer";
    }
    else if (userDetails?.role == "user") {
      role = "user";
    }
  } 

  console.log(data.user?.id);
  console.log(role);

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

// Συναρτήσεις για κατηγορίες και φόρμες

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
  .select('title, context, fields')
  .eq('id', formId) 
  .single()

  if (error) {
    console.error(error);
    return null; 
  } 

  console.log(form)

  return form;
}

export async function insertUserForm(formTitle: string,
  formData: { [key: string]: string | number | File}
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

  const processedFormData: { [key: string]: string | number } = {}
  for (const [key, value] of Object.entries(formData)) {
    if (value instanceof File) {
      const fileUrl = await uploadFilesToSupabase(value)
      if (fileUrl) {
        processedFormData[key] = fileUrl
      }
    } else {
      processedFormData[key] = value
    }
  }

  const { data: dat } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
  .from('user_form_submissions')
  .insert([
    { formTitle: formTitle,
      form_data: processedFormData,
      officer_id: officer_id,
      user_id: dat.user?.id,
      done: false
    }
  ])
  .select()

  if (error) {
    console.error(error);
  } 
  else {
    console.error(data);
  } 

  return data
  
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

export async function uploadFilesToSupabase(file: File): Promise<string | null> {
  const supabase = createClient()

  //Το αρχείο παίρνει τυχαίο όνομα
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`

  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file)

  if (uploadError) {
    console.error("Error uploading file:", uploadError)
    return null
  }

  
  const { data: urlData, error: urlError } = await supabase.storage
    .from("avatars")
    .createSignedUrl(fileName, 60 * 60 * 24 * 365 * 10) // 10 χρονια

  if (urlError) {
    console.error("Error generating signed URL:", urlError)
    return null
  }

  
  return urlData?.signedUrl || null
}

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
  .update({ role: newRole})
  .eq('email', userEmail)
  .select()

  if (error) {
    console.error(error);
    return []; 
  } 

}