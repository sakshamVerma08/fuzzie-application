
"use client";
import { CldUploadButton } from 'next-cloudinary';
import { toast } from "sonner"
type Props = {
    onUploaded?: (info?:any) => void;
    uploadPreset?: string,
    className?: string,
};

const CloudinaryButton = (props:Props)=>{

    return (
<div>

    <CldUploadButton uploadPreset="fuzzie-application" className='cursor-pointer border-2 p-2 rounded-md hover:bg-[#2F006B] hover:text-white hover:border-4'/>
        
</div>
    );
}


export default CloudinaryButton;