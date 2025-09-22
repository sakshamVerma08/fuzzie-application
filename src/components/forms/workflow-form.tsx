'use client';
import { WorkflowFormSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation';
import {useForm } from 'react-hook-form'
import {z} from "zod";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form,FormControl,FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

type Props = {
    title?: string,
    subTitle?: string,
}

const WorkflowForm = ({title,subTitle}: Props) => {

    const form = useForm<z.infer<typeof WorkflowFormSchema>>({

        mode: "onChange",
        resolver: zodResolver(WorkflowFormSchema),
        defaultValues:{
            name: '',
            description: '',

        },
    });

    const isLoading = form.formState.isLoading;
    const router = useRouter();

    const handleSubmit = ()=>{

    }


  return (
        <Card className='w-full max-w-[650px] border-none'>
            {title && subTitle && (

                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{subTitle}</CardDescription>
                </CardHeader>
            )}

            <CardContent>
                <Form {...form}>

                    <form className='flex flex-col gap-4 text-left'>

                        <FormField
                            disabled={isLoading}
                            name="name"
                            control={form.control}
                            render={({field})=>(

                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Name' {...field} />
                                    </FormControl>
                                    <FormMessage/>

                                </FormItem>
                            )}

                        />

                        <FormField
                        disabled={isLoading} 
                        name="description"
                        control={form.control}
                        render={({field})=>(

                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder='Description'/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>


                                )}/>

                        <Button className='mt-4'
                        disabled={isLoading} 
                        type="submit">

                            {isLoading? (

                                <>
                                <Loader2 className='mr-2 h-4 w-4 aniamte-spin'/>Saving
                                </>
                            ): (
                                'Save Settings'
                            )
                            
                            }
                        </Button>


                   
                    </form>

                </Form>
            </CardContent>

        </Card>
  )
}

export default WorkflowForm;