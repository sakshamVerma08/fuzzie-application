import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = async() => {
  return (
    <header className = "fixed right-0 left-0 top-0 flex items-center justify-between z-[100] backdrop-blur-lg bg-black/40 py-4 px-4 border-b-[1px] border-neutral-900 ">

{/* Left Section of Navbar */}
        <aside className = "flex items-center gap-[2px]">

            <p className='text-3xl font-bold'>Fu</p>

            <Image src = "/fuzzieLogo.png" width={15} height = {15} alt = "Fuzzie-logo" className = "shadow-sm"/>

            <p className="text-3xl font-bold">zie</p>
        </aside>

{/* Center Section of Navbar */}
        <nav className='absolute left-[50%] top-[50%] md:block transform translate-x-[-50%] translate-y-[-50%] hidden'>

            <ul className='flex items-center gap-4 list-none'>
                <li>
                    <Link href = "#">Products</Link>
                </li>
                <li>
                    <Link href = "#">Pricing</Link>
                </li>
                <li>
                    <Link href = "#">Clients</Link>
                </li>
                <li>
                    <Link href = "#">Resources</Link>
                </li>
                <li>
                    <Link href = "#">Documentation</Link>
                </li>
                <li>
                    <Link href = "#">Enterprise</Link>
                </li>
            </ul>
        </nav>

{/* Right Section of Navbar */}
        <aside className = "flex items-center gap-4">

            <Link href = "/dashboard" className='relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
            
          

  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    {// WIP: Wire up User
    true?'Dashboard':'Get Started' /* This can be dynamic based on user state or props */}

  </span>
            
            </Link>

            {
                // WIP: Wire up User
            }

            <MenuIcon className='md:hidden'/>
        </aside>
    </header>
  )
}

export default Navbar