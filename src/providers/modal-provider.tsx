'use client';
import React, {useContext, createContext, useEffect,useState} from "react";

interface ModalProviderProps{

    children: React.ReactNode
};

type ModalData = {};

type ModalContextType = {
    data: ModalData,
    isOpen: boolean,
    setIsOpen:(modal:React.ReactNode, fetchData?: ()=>Promise<any>)=>void,

    setClose: ()=>void
};

export const ModalContext = createContext<ModalContextType>({

    data: {},
    isOpen:false,
    setIsOpen: (modal:React.ReactNode, fetchData?: ()=>Promise<any>)=>{},
    setClose: ()=>{}

});


const ModalProvider: React.FC<ModalProviderProps> = ({children})=>{

    const [isOpen,setIsOpen] = useState(false);
    const [data,setData] = useState<ModalData>({});
    const [showingModal,setShowingModal] = useState<React.ReactNode>(null);
    const [isMounted,setIsMounted] = useState(false);

    
    
    
    useEffect(()=>{
        setIsMounted(true);
    },[]);

    const setOpen = async (modal: React.ReactNode, fetchData?: ()=>Promise<any>)=>{

        if(modal){
            if(fetchData)
            setData({...data, ...(await fetchData()) || {} });
        

        setIsOpen(true);
        setShowingModal(modal);
        }
    }

    const setClose = ()=>{
        setIsOpen(false);
        setData({});
    }

    if(!isMounted) return null;




    return <ModalContext.Provider value = {{data,isOpen,setIsOpen:setOpen,setClose}}>

        {children}
        {showingModal}
    </ModalContext.Provider>

}


export const useModal = ()=>{

    const context = useContext(ModalContext);

    if(!context){
        throw new Error("useModal must be used with the Modal Provider");
    }

    return context;
}

export default ModalProvider;