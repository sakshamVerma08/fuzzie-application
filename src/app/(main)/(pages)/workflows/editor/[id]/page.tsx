'use client';

import { ConnectionsProvider } from '@/providers/connections-provider';
import EditorProvider from '../../../../../../providers/editor-provider';
import  React, { use } from 'react'
import EditorCanvas from './_components/editor-canvas';
// import Page from '../../page';

type Props = {
    params: Promise<{id: string}>
}

const Page = ({params}: Props) => {

    const {id} = use(params);

  return (
    <div className='overflow-y-hidden!'>
        
        <EditorProvider>
            <ConnectionsProvider>
              <div className='h-screen!'><EditorCanvas/></div>
             
            </ConnectionsProvider>
        </EditorProvider>
    </div>
  )
}

export default Page;