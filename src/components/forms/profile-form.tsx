"use client";

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { EditUserProfileSchema } from '@/lib/types';
import { Form, FormControl, FormField, FormItem,FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
type Props = {}


const ProfileForm = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof EditUserProfileSchema>>({

      mode:"onChange",
      resolver:zodResolver(EditUserProfileSchema),
      defaultValues:{
        name:"",
        email:""
      }
    })


  return (
    <Form {...form} >
      
      <form className = "flex flex-col gap-6" onSubmit = {()=>{}}>

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

              <Input  placeholder = "Name" {...field}/>


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

                <Input placeholder = "Email..." 
                type="email"
                {...field}
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