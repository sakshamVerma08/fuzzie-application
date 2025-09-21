'use client';
import WorkflowForm from '@/components/forms/workflow-form';
import CustomModal from '@/components/global/custom-modal';
import { Button } from '@/components/ui/button';
import { useModal } from '@/providers/modal-provider';
import { Plus } from 'lucide-react';
import React from 'react'

type Props = {}

const WorkflowButton = (props: Props) => {

  const {setIsOpen,setClose} = useModal();
  
    const handleClick = ()=>{
      setIsOpen(<CustomModal title = "Create a Workflow Automation"
      subHeading='Workflows are a powerful tool that help you automate tasks'>

        <WorkflowForm/>
      </CustomModal>)

    };


  return (
    <Button size="icon" onClick = {handleClick}>

        <Plus/>
    </Button>
  ) 
}

export default WorkflowButton;