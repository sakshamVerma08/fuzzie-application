import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useModal } from "@/providers/modal-provider"
import React from "react"
import { Button } from "../ui/button"


type Props = {
    title: string,
    subHeading: string,
    children: React.ReactNode,
    defaultOpen?: boolean,
}

const CustomModal = ({title,subHeading,children,defaultOpen}: Props) => {
    const {isOpen,setClose} = useModal();

    const handleClose = ()=> setClose();


  return (
    <Drawer
    open = {isOpen}
    onClose={handleClose}>

        <DrawerContent>

            <DrawerHeader>

                <DrawerTitle className="text-center">
                    {title}
                </DrawerTitle>
                
                {/* Instead of <DrawerDescription></DrawerDescription>, used a div to resolve hydration errors.*/}
                <div className="text-center flex flex-col items-center gap-4 h-96">
                    {subHeading}
                    {children}
                </div>
            </DrawerHeader>

            

            <DrawerFooter className="flex flex-col gap-4 bg-background border-t-[1px] border-t-muted">

                <DrawerClose>
                    <Button
                    variant = "ghost"
                    onClick={handleClose}
                    className="w-full">

                        Close
                    </Button>
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default CustomModal;