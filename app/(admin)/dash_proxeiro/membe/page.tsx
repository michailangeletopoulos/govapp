"use client";

import { getAllProfiles, getProfileRole, updateRole } from '@/app/(user)/user_details/getProfile'
import { Avatar,
  AvatarFallback,
  AvatarImage,
 } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
 } from '@/components/ui/card'
import { Command, 
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
 } from '@/components/ui/command'
import { Popover, 
  PopoverContent,
  PopoverTrigger,
 } from '@/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from "sonner"
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type Profile = {
  full_name: string;
  role: string;
  email: string;
};

const Page = () => {
  const [userDetails, setUserDetails] = useState<Profile[]>([]); 

  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter()

  useEffect(() => {
    
    const fetchProfiles = async () => {
      const profiles = await getAllProfiles();
      setUserDetails(profiles);
    };

    const isUserLog = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser()
        
      if (!user) {
       router.push("/login?need_logIn=true")
      }

      const role = await getProfileRole();
          
      console.log(role);
          
      if (role != "admin") {
        router.push("./");
      }
    };

    isUserLog()
    fetchProfiles();
  }, []);

  const filteredProfiles = userDetails.filter(profile =>
    profile.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
      <Card>
      <CardHeader>
        <CardTitle>Χρήστες και Ομάδα</CardTitle>
        <CardDescription>
          Δείτε τους χρήστες τις εφαρμογής και αλλάξτε τους ρόλο
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Input
          placeholder="Αναζήτηση με ονοματεπώνυμο..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="grid gap-6">
          {filteredProfiles.map((profile, index) => (
            <div key={profile.email} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{profile.full_name[0]}{profile.full_name.split(" ")[1]?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{profile.full_name}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
              <Select
                defaultValue={profile.role}
                onValueChange={(value) => {
                  updateRole(profile.email, value); 
                  toast.success('Επιτυχής αλλαγή ρόλου');
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Υπεύθυνος</SelectItem>
                  <SelectItem value="officer">Υπάλληλος</SelectItem>
                  <SelectItem value="user">Απλός χρήστης</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    ) 
     
    
} 

export default Page