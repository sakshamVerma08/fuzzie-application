import React from 'react'
import Workflow from './workflow';

type Props = {}

const Workflows = (props: Props) => {
  return (
    <div className='relative flex flex-col'>

        <section className='flex flex-col gap-4 p-6'>

          <Workflow description='random flow' id="278394dl892374"
          name='Automation Workflow' publish={false}/>
        </section>
    </div>
  )
}

export default Workflows;