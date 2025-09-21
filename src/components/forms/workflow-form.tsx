'use client';
import { WorkflowFormSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'
import {z} from "zod";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

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

  return (
        <Card className='w-full max-w-[650px] border-none'>
            {title && subTitle && (

                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{subTitle}</CardDescription>
                </CardHeader>
            )}

            <CardContent>

            </CardContent>

        </Card>
  )
}

export default WorkflowForm;