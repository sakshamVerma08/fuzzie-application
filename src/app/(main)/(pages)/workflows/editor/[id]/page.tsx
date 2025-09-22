'use client';

import EditorProvider from '../../../../../../providers/editor-provider';
import  React, { use } from 'react'
// import Page from '../../page';

type Props = {
    params: Promise<{id: string}>
}

const Page = ({params}: Props) => {

    const {id} = use(params);

  return (
    <div>
        
        <EditorProvider>
            <div></div>
        </EditorProvider>
    </div>
  )
}

export default Page;