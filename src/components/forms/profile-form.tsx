"use client";

import React, { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { EditUserProfileSchema } from '@/lib/types';
import { Form, FormControl, FormField, FormItem,FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { User } from '@prisma/client';

type Props = {

  user: User,
  onUpdate: (name: string)=>Promise<any>

}


const ProfileForm = ({onUpdate,user}: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof EditUserProfileSchema>>({

      mode:"onChange",
      resolver:zodResolver(EditUserProfileSchema),
      defaultValues:{
        name: user.name ?? undefined,
        email: user.email ?? undefined
      }
    });


    const handleSubmit = async (
      values: z.infer<typeof EditUserProfileSchema>
    )=>{

      setIsLoading(true);
      await onUpdate(values.name);
      setIsLoading(false);
    }

    useEffect(()=>{

      form.reset({
        
        name: user.name ?? undefined, email: user.email ?? undefined
      
      });
    },[user]);


  return (
    <Form {...form} >
      
      <form className = "flex flex-col gap-6" onSubmit = {form.handleSubmit(handleSubmit)}>

        <FormField 
        disabled={isLoading}
        name = "name"
        control = {form.control}
        render={({field})=>{
          
          return(
          <FormItem>

            <FormLabel className = "text-lg">
              User fullname
            </FormLabel>

            <FormControl>

              <Input
               {...field}
                placeholder = "Name"
              
               />


            </FormControl>
          </FormItem>
          );
        }}/>

        <FormField disabled={isLoading || true} name = "email" control={form.control}
        render = {({field})=>{

          return(
            <FormItem>

              <FormLabel className='text-lg'>

                User Email
              </FormLabel>

              <FormControl>

                <Input
                {...field}
                placeholder = "Email..." 
                type="email"
                
                disabled/>
              </FormControl>
            </FormItem>
          );
        }}/>

        <Button className = "self-start hover:bg-[#2F006B] hover:text-white cursor-pointer" 
        type = "submit"
        >

          {isLoading?(
            <>
             <Loader2 className = "h-4 w-4 mr-2 animate-spin"/>
            Saving
            </>
           
          ): (

            "Save User Settings"
          ) }


        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm;