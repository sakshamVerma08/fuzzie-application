'use client';

import { Button } from '@/components/ui/button';
import { useNodeConnections } from '@/providers/connections-provider';
import { usePathname } from 'next/navigation';
import React, { useCallback, useState } from 'react'

type Props = {
    children: any[],
    edges: any[],
    nodes: any[],
};

const FlowInstance = ({children,nodes,edges}: Props) => {
    const pathname = usePathname();
    const [isFlow,setIsFlow] = useState([]);
    const {nodeConnection} = useNodeConnections();

    const onFlowAutomation = useCallback(()=>{


    },[]);
  return (

    <div className='flex flex-col gap-2'>
        <div className='flex gap-3 p-4'>
            <Button onClick = {onFlowAutomation} disabled= {isFlow.length < 1}>

                    Save
            </Button>
        </div>
    </div>

  )
}

export default FlowInstance;