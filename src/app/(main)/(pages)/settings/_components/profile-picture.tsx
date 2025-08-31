"use client";

import React, { useEffect, useState } from 'react'
import { toast } from "sonner"
import axios from "axios";
import CloudinaryButton from './cloudinary-button';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type Props = {}

const ProfilePicture = (props: Props) => {

  // Checking if the profile image exists in DB or not
  useEffect(() => {

    const fetchProfileImage = async()=>{

      try{
        
      const response = await axios.get("http://localhost:3000/api/v1/getProfileImage");

      if(response.status==200){
        setPreviewURL(response.data.url);
      }

    }catch(err){
      console.error("Error while getting the profile image URL",err);

    }

    }


    fetchProfileImage();
  }, [])
  

    // WIP: When the upload is successful, alert the user that the profile image has been uploaded. Store this previewURL in DB as well. Then, fetch profile image from DB whenever page is reloaded.
    const [previewURL, setPreviewURL] = useState<string|undefined>(undefined);

    const router = useRouter();


    const handleUploaded = async (info?:any)=>{
      // Store the url in DB as well.
      const url = info?.seculre_url ?? info?.url;

      if(url) setPreviewURL(url);
      console.log("\nProfile Image URL = ",url);

      try{

        const res = await axios.post("http://localhost:3000/api/v1/saveProfileImage",{
          url: JSON.stringify(url)
        }, {
          headers:{"Content-Type":"application/json"}
        });

        if(res.status==200){
          toast.success("Profile Image uploaded successfully");
        }

      }catch(err){
        console.log("Error while storing profile Image URL in the DB",err);
        toast.error("Something went wrong. Please try again");
      }
    }


    const onRemoveProfileImage = async()=>{
      

      try{

        const response = await axios.post("http://localhost:3000/api/v1/deleteProfileImage",{
          publicId: JSON.stringify(previewURL)
        },
        
        {
          headers: {"Content-Type":"application/json"}
          
        });

      
      if(response.status==200){
        toast.success("Profile Image removed",{
            description: "Image removed successfully"
        });

      }

      router.refresh();

      }catch(err){
        console.log("Error while deleting profile image");
        console.log(err);
        toast.error("Something went wrong. Please try again");
      }

    }


  return (
    <div className = "flex flex-col">

        <p className='text-lg text-white'>Profile Picture</p>
        <div className="flex h-[30vh] flex-col items-center justify-center">

            {previewURL? (
                
                <>
                
                  <div className='relative h-full w-2/12'>
                    <img src = {previewURL} alt = "User_image"/>
                  </div>
                  <Button variant={"destructive"}  className = "cursor-pointer" onClick={onRemoveProfileImage}><X/>Remove Profile Image</Button>
                </>
                
            ) : ( 
              <CloudinaryButton uploadPreset = "fuzzie-application" className = "cursor-pointer border-2 p-2 rounded-md hover:bg-[#2F006B] hover:text-white hover:border-4"  onUploaded={handleUploaded}/>
            )
            }
        </div>
    </div>
  )
}

export default ProfilePicture;