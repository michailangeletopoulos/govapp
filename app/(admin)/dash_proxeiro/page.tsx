// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getProfileRoleServer } from '@/app/(user)/user_details/getProfileServer'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const DashboardPage = async () => {
  const role = await getProfileRoleServer();

  console.log(role);

  if (role == "user") {
    redirect("./");
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Store Name</CardTitle>
          <CardDescription>
            Used to identify your store in the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Store Name" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Plugins Directory</CardTitle>
          <CardDescription>
            The directory within your project, in which your plugins are
            located.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Input
              placeholder="Project Name"
              defaultValue="/content/plugins"
            />
            <div className="flex items-center space-x-2">
              <Checkbox id="include" defaultChecked />
              <label
                htmlFor="include"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow administrators to change the directory.
              </label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default DashboardPage