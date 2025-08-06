"use client"

import { usePathname } from 'next/navigation';
import React from 'react'
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
type Props = {};

const Sidebar = (props:Props) => {

    const pathName = usePathname();

  return (
    <nav className='dark:bg-black h-screen overflow-scroll flex justify-between items-center flex-col gap-10 py-6 px-2'>

        <div className='flex items-center justify-center flex-col gap-8'>

            <Link className = "flex font-bold flex-row" href = "/">
                fuzzie.
            </Link>
        </div>
    </nav>
  )
}

export default Sidebar;