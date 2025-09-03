'use client';

import { UserButton } from '@clerk/nextjs';
import React from 'react'

const DashboardPage = () => {
  return (
  
  <div className=' flex flex-col gap-4 relative'>

    <div className='absolute right-5 top-10'>
      <UserButton/>
      </div>
    <h1 className='text-4xl  sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b'>Dashboard</h1>
  </div>
  );
}

export default DashboardPage;