"use client";

import { getAllProfiles } from '@/app/(user)/user_details/getProfile'
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

type Profile = {
  full_name: string;
  role: string;
  email: string;
};

const Page = () => {
  const [userDetails, setUserDetails] = useState<Profile[]>([]); 

  useEffect(() => {
    // Fetch the profiles data when the component mounts
    const fetchProfiles = async () => {
      const profiles = await getAllProfiles();
      setUserDetails(profiles);
    };

    fetchProfiles();
  }, []);

  

    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Invite your team members to collaborate.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {userDetails.map((user, index) => (
            <div className="flex items-center justify-between space-x-4" key={index}>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`/avatars/${index + 1}.png`} />
                  <AvatarFallback>{user.full_name[0]}{user.full_name.split(" ")[1]?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user.full_name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    {user.role}{" "}
                    <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Select new role..." />
                    <CommandList>
                      <CommandEmpty>No roles found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                          <p>Admin</p>
                          <p className="text-sm text-muted-foreground">
                            Μπορεί να αναθέτει.
                          </p>
                        </CommandItem>
                        <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                          <p>Officer</p>
                          <p className="text-sm text-muted-foreground">
                            Μπορεί να απαντάει.
                          </p>
                        </CommandItem>
                        <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                          <p>User</p>
                          <p className="text-sm text-muted-foreground">
                            Μπορεί να ζητάει.
                          </p>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </CardContent>
      </Card>
    ) 
     
    
} 

export default Page