"use client";

import React , {useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategories } from '@/app/(user)/user_details/getProfile';
import { createClient } from "@/utils/supabase/client";
import { Textarea } from '@/components/ui/textarea';


type Categories = {
  id: number;
  category: string;
}

const page = () => {

  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const categories = await getCategories();
    setCategories(categories || []);
    setIsLoading(false);
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    console.log("dsa");
    const supabase = createClient();
    event.preventDefault();
    console.log("dsa");

    // Insert data into Supabase table
    const { data, error } = await supabase
      .from('form') // Assuming your table is called 'categories'
      .insert([
        {
          title: title,       // title from state
          category: selectedCategory, // category from state
          context: context,   // context from state
        },
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted:');
      // Optionally reset form after submission
      setTitle('');
      setSelectedCategory('');
      setContext('');
    }
  };

  

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Τίτλος</Label>
              <Input
            id="title"
            placeholder="Τίτλος της φόρμας"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Κατηγορία</Label>
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.category}>
                    {category.category}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="context">Κείμενο</Label>
              
              <Textarea
              id="context"
              placeholder="Περιγραφή της φόρμας"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => {
          setTitle('');
          setSelectedCategory('');
          setContext('');
        }}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit} >Submit</Button>
      </CardFooter>
    </Card>
  )
}

export default page