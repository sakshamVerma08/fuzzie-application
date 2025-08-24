
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

    <CldUploadButton 
    uploadPreset={props.uploadPreset} 
    className={props.className} 
    
    onSuccess = {(result,{widget})=>{

        const info = result?.info;

        toast.success("Upload successful",{
            description: "Image uploaded successfully"
        });

        if(props.onUploaded){
            props.onUploaded(info);
        }

        widget?.close?.();

        
    }}
    
    onError={(err)=>{

        console.log("Cloudinary Upload Error", err);
        toast.error("Error while uploading image. Try again");
    }}
        />
        
</div>
    );
}


export default CloudinaryButton;