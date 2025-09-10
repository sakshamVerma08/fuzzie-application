import ProfileForm from '@/components/forms/profile-form';
import ProfilePicture from './_components/profile-picture';
// import { useUser } from '@clerk/nextjs';
import { currentUser} from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { User } from '@prisma/client';

type Props = {}

const Settings = async(props: Props) => {
  
  const authUser = await currentUser();

  if(!authUser){
    return <div className='h-full w-full flex items-center justify-center '>
      
      <h1 className='text-2xl font-semibold'>You're not authorized</h1>
      
      </div>
  };

  const user = await db.user.findUnique({
    where: {clerkId: authUser.id}
  });

  const handleProfileFormSubmission = ()=>{
    'use server';

    
  }

  return (
    // WIP: Wire up Profile Picture
    <div className='flex flex-col gap-4'>

        <h1 className='sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg'>
            <span>Settings</span>
        </h1>

        <div className="flex flex-col gap-10 p-6">

            <div>

                <h2 className='text-2xl font-bold'>User Profile </h2>
                <p className='text-base text-white/50'>Add or update your information</p>
            </div>
            <ProfilePicture>
    

            </ProfilePicture>

            {user? (
              
              <ProfileForm user = {user} submitHandler = {handleProfileFormSubmission}/> )
            
            :( <div> User not found in DB.</div>
            
              )}
        </div>
    </div>
  )
}

export default Settings;