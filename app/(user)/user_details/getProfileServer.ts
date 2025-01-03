import { createClient } from "@/utils/supabase/server";

export async function getProfileRoleServer() {
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