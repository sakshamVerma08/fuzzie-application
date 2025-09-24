'use server';
import { db } from '@/lib/db'
import React from 'react'

export const onCreateNodeEdges = async (
    flowId: string,
    nodes: string,
    edges: string,
    flowPath: string,
) => {
  
    const flow = await db.workflows.update({
        where:{
            id:flowId,
        },

        data:{
            nodes,
            edges,
            flowPath: flowPath,
        },
    });


    if(flow) return {message:"Flow Saved"};
}

export const onFlowPublish = async(
    workflowId: string,
    state: boolean,
) =>{

    console.log(state);
    const published = await db.workflows.update({
        where:{
            id: workflowId,
        },

        data:{
            publish:state,
        },
    });

    if(published.publish) return {message:"Workflow Published"};
    return {message:"Workflow Un-published"};
}