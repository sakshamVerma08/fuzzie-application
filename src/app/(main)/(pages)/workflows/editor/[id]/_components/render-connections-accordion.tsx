'use client';
import { Connection } from '@/lib/types';
import { useNodeConnections } from '@/providers/connections-provider';
import { EditorState } from '@/providers/editor-provider';
import React from 'react'


type Props = {
    connection: Connection,
    state: EditorState
}
const RenderConnectionAccordion = ({connection,state}:Props) => {

    const {title,image,description,connectionKey,accessTokenKey,alwaysTrue,slackSpecial} = connection;

    const {nodeConnection} = useNodeConnections();
    
  return (
    <div>render-connections-accordion</div>
  )
}

export default RenderConnectionAccordion;