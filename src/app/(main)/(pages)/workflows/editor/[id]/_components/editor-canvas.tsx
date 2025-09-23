'use client';
import React, { useMemo } from 'react'
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, ReactFlowInstance, NodeChange, EdgeChange, Connection, Edge, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { EditorCanvasCardType, EditorNodeType } from '@/lib/types';
import { useEditor } from '@/providers/editor-provider';
import EditorCanvasCardSingle from './editor-canvas-card-single';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import {v4} from "uuid";
import { EditorCanvasDefaultCardTypes } from '@/lib/constant';
import { Changa_One } from 'next/font/google';


type Props = {};

const initialNodes: EditorNodeType[] = [];
const initialEdges: {id:string,source:string,target: string}[] = [];

const EditorCanvas = (props: Props) => {

  const [reactFlowInstance,setReactFlowInstance] = useState<ReactFlowInstance>();
  const [nodes,setNodes] = useState(initialNodes);
  const [edges,setEdges] = useState(initialEdges);
  const[isWorkflowLoading,setIsWorkflowLoading] = useState<boolean>(false);

  const pathname = usePathname();

    const {dispatch,state} = useEditor();

    const nodeTypes = useMemo(()=>({

        Action: EditorCanvasCardSingle,
        Trigger: EditorCanvasCardSingle,
        Email: EditorCanvasCardSingle,
        Condition: EditorCanvasCardSingle,
        AI: EditorCanvasCardSingle,
        Slack: EditorCanvasCardSingle,
        "Google Drive": EditorCanvasCardSingle,
        Notion: EditorCanvasCardSingle,
        Discord: EditorCanvasCardSingle,
        'Custom Webhook': EditorCanvasCardSingle,
        'Google Calendar': EditorCanvasCardSingle,
        Wait: EditorCanvasCardSingle,

    }), []);


    const onDragOver = useCallback((event: any)=>{

      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },[]);


    const onNodesChange = useCallback((changes: NodeChange[])=>{
      //@ts-ignore
      setNodes((nds)=> applyNodeChanges(changes,nds));

    },[setNodes]);


    const onEdgesChange = useCallback((changes: EdgeChange[])=>{

      setEdges((nds)=> applyEdgeChanges(changes,nds));

    },[setEdges]);


    const onConnect = useCallback((params: Edge | Connection)=>{

      setEdges((eds)=> addEdge(params, eds));

    },[]);

    const handleClickCanvas = ()=>{
      dispatch({
        type: 'SELECTED_ELEMENT',
        payload:{

          element:{
            data:{
              completed:false,
              current:false,
              description: '',
              metadata:{},
              title: '',
              type: 'Trigger',

            },
            id: '',
            position: {x:0,y:0},
            type:'Trigger',
          },
        },
      });
    }

    const onDrop = useCallback((event: any)=>{

      event.preventDefault();

      const type: EditorCanvasCardType['type'] = event.dataTransfer.getData(
        'application/reactflow'
      );

      // check if the dropped element is valid or not

      if(typeof type === 'undefined' || !type){
        return;
      }

      const triggerAlreadyExists = state.editor.elements.find(
        (node)=> node.type === 'Trigger'
      );

      if(type === 'Trigger'  && triggerAlreadyExists){
        toast("Only one trigger can be added to automations at the moment");
        return;
      }


      if(!reactFlowInstance){
        return;
      }

      const position = reactFlowInstance.flowToScreenPosition({
        x: event.clientX,
        y: event.clientY
      });

      const newNode = ({
        id: v4(),
        type,
        position,
        data:{
          title: type,
          description: EditorCanvasDefaultCardTypes[type].description,
          completed: false,
          current: false,
          metadata: {},
          type:type,
        }
      });

      //@ts-ignore

      setNodes((nds)=>nds.concat(newNode));

    },[reactFlowInstance,state]);

    
    // WIP: isWorkFlowLoading, fix it.
  return (
    <ResizablePanelGroup 
    direction="horizontal"
    >

      <ResizablePanel
      defaultSize={70}>

        <div className = "flex h-full items-center justify-ceter">

          <div className='relative' style={{width:'100%', height: '100%', paddingBottom: '70px'}}>

            <ReactFlow
            className='w-[300px]'
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodes={state.editor.elements}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            fitView
            onClick={handleClickCanvas}
            nodeTypes={nodeTypes}
            >
              
              <Controls position='top-left'/>
              <MiniMap
              position="bottom-left"
              className='!bg-background'
              zoomable
              pannable>


              </MiniMap>

            </ReactFlow>

          </div>

        </div>

      </ResizablePanel>

      <ResizableHandle/>

      <ResizableHandle>
        Two
      </ResizableHandle>
      
    </ResizablePanelGroup>
  )
}

export default EditorCanvas;