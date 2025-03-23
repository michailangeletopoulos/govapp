import { redirect } from "next/navigation";
import { getProfileRoleServer } from '@/app/(user)/user_details/getProfileServer'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const DashboardPage = async () => {

  const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) {
      redirect("/login?need_logIn=true")
    }

  const role = await getProfileRoleServer();

  console.log(role);

  if (role != "admin") {
    redirect("./");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Λειτουργίες</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Link href="./dash_proxeiro/membe" className="block">
          <Card className="w-full h-64 flex items-center justify-center bg-white shadow-lg transition-transform hover:scale-105">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-800 text-center">Χρήστες και Ομάδα</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link href="./dash_proxeiro/tsar" className="block">
          <Card className="w-full h-64 flex items-center justify-center bg-white shadow-lg transition-transform hover:scale-105">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-800 text-center">Γραφήματα</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage