"use client";

import { getAllProfiles, updateRole } from '@/app/(user)/user_details/getProfile'
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

type Profile = {
  full_name: string;
  role: string;
  email: string;
};

const Page = () => {
  const [userDetails, setUserDetails] = useState<Profile[]>([]); 

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch the profiles data when the component mounts
    const fetchProfiles = async () => {
      const profiles = await getAllProfiles();
      setUserDetails(profiles);
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = userDetails.filter(profile =>
    profile.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (/*
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
      </Card> */
      <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Manage your team members and their roles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="grid gap-6">
          {filteredProfiles.map((profile, index) => (
            <div key={profile.email} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`/avatars/${index + 1}.png`} />
                  <AvatarFallback>{profile.full_name[0]}{profile.full_name.split(" ")[1]?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{profile.full_name}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
              <Select
                defaultValue={profile.role}
                onValueChange={(value) => updateRole(profile.email, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="officer">Officer</SelectItem>
                  <SelectItem value="user">User</SelectItem>
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