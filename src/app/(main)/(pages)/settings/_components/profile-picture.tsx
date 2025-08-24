import React from 'react'
import CloudinaryButton from './cloudinary-button';

type Props = {}

const ProfilePicture = (props: Props) => {
    // WIP: When the upload is successful, alert the user that the profile image has been uploaded
  return (
    <div className = "flex flex-col">

        <p className='text-lg text-white'>Profile Picture</p>
        <div className="flex h-[30vh] flex-col items-center justify-center">

            <CloudinaryButton/>
        </div>
    </div>
  )
}

export default ProfilePicture;