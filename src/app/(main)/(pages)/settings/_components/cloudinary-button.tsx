
"use client";
import { CldUploadButton } from 'next-cloudinary';
type Props = {};

const CloudinaryButton = (props:Props)=>{

    return (
<div>

    <CldUploadButton uploadPreset="fuzzie-application" className='cursor-pointer'/>

</div>
    );
}


export default CloudinaryButton;