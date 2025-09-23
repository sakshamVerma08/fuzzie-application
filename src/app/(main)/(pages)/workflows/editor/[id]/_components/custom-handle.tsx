import { useEditor } from '@/providers/editor-provider';
import { Handle, HandleProps, useStore } from '@xyflow/react'
import React, { CSSProperties } from 'react'

type Props = HandleProps & {style?: CSSProperties};


const selector = (s:any) =>({

    nodeInternals: s.nodeInternals,
    edges: s.edges,
})

const CustomHandle = (props: Props) => {
    const {state} = useEditor();

    const {nodeInternals, edges} = useStore(selector);
  return (
    <Handle 
    {...props}
    isValidConnection={(e)=>{
        const sourceFromHandleInstance = state.editor.edges.filter((edge)=>edge.source===e.source).length;

        const sourceNode = state.editor.elements.find((node)=>node.id===e.source);

        const targetFromHandleInstance = state.editor.edges.filter((edge)=>edge.target===e.target).length;

        if(targetFromHandleInstance===1) return false;
        if(sourceNode?.type==="Condition") return true;
        if(sourceFromHandleInstance < 1) return true;

        return false;
    }}

    className='!-bottom-2 !h-4 !w-4 !dark:bg-neutral-800'

    />
  )
}

export default CustomHandle;