"use client";
import React, { useState } from 'react'
import CloudinaryButton from './cloudinary-button';

type Props = {}

const ProfilePicture = (props: Props) => {
    // WIP: When the upload is successful, alert the user that the profile image has been uploaded
    const [previewURL, setPreviewURL] = useState<string|undefined>(undefined);

    const handleUploaded = (info?:any)=>{
      const url = info?.seculre_url ?? info?.url;

      if(url) setPreviewURL(url);
    }


  return (
    <div className = "flex flex-col">

        <p className='text-lg text-white'>Profile Picture</p>
        <div className="flex h-[30vh] flex-col items-center justify-center">

            <CloudinaryButton uploadPreset = "fuzzie-application" className = "cursor-pointer border-2 p-2 rounded-md hover:bg-[#2F006B] hover:text-white hover:border-4" onUploaded={handleUploaded}/>

            {previewURL? (
              <img
              src = {previewURL}
              alt = "Profile preview"
              className="mt-2 h-28 w-28 rounded-full object-cover"/>
            ) : ( 
              <div className='mt-2 h-28 w-28 bg-zinc-800/60 rounded-full'/>
            )
            }
        </div>
    </div>
  )
}

export default ProfilePicture;