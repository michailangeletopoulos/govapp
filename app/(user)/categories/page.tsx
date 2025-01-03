"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import React, { useEffect, useState } from 'react'
import { getCategories, getTitleForm } from "../user_details/getProfile";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { useRouter } from 'next/navigation';

type Categories = {
    id: number;
    category: string;
}

type Form = {
    id: number;
    title: string;
    context: string;
}

const Page = () => {
  const router = useRouter();

  const [categories, setCategories] = useState<Categories[]>([]);
  const [titleForms, setTitleForms] = useState<Record<string, Form[]>>({});

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const categories = await getCategories();
    setCategories(categories || []);
  };

  const fetchTitleForms = async (category: string) => {
    if (!titleForms[category]) {
      const titles = await getTitleForm(category);
      setTitleForms(prev => ({ ...prev, [category]: titles || [] }));
    }
  };

  const goToFormPage = (titleId: number) => {
    
    //redirect(`../forms/${titleId}`);
    router.push(`./forms/${titleId}`);
    
  }

  return (
    <div className="container mx-auto py-8">
      <Accordion type="single" collapsible className="w-full">
        {categories.map((category) => (
          <AccordionItem key={category.id} value={category.category}>
            <AccordionTrigger 
              onClick={() => fetchTitleForms(category.category)}
              className="text-lg font-semibold"
            >
              {category.category}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-center py-4">
                <Carousel className="w-full max-w-3xl">
                  <CarouselContent>
                    {titleForms[category.category]?.map((title) => (
                      <CarouselItem key={title.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                        <Card className="h-full">
                          <CardContent className="flex items-center justify-center p-6 h-full">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="w-full h-full text-sm">
                                  {title.title}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>{title.title}</DialogTitle>
                                  <DialogDescription>
                                    Περιγραφή
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p>{title.context}</p>
                                </div>
                                <DialogFooter>
                                  <Button onClick={() => goToFormPage(title.id)}>Ανακατεύθυνση</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default Page