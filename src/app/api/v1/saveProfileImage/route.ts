import { NextRequest, NextResponse } from "next/server";
import {db} from "../../../../lib/db";
import {currentUser } from "@clerk/nextjs/server";
import { ClerkClient, createClerkClient } from "@clerk/backend";
export async function POST(req:NextRequest){

    try{

        // Instantiating a Custom Clerk Client.
        const clerkClient = createClerkClient({secretKey: process.env.CLERK_SECRET_KEY});
        

        const authUser = await currentUser();
        if(!authUser){
            return NextResponse.json({message:"Authenticated User doesn't exist on Clerk"}, {status:404});

        }
        const {url} = await req.json();

        if(!url){
            return NextResponse.json({message:"The Profile Image URL was not found"},{status:404})
        }

        const cleanURL = url.replace(/"/g, '');// Remove any extra quotes ("") because they get encoded as %22, then it gives
        // issues when fetching the image from Cloudinary     

        const user = await db.user.findFirst({
            where:{
                clerkId: authUser.id
            },

        });


        if(!user){
            return NextResponse.json({message:"Authenticated User not found in DB"}, {status:404});
        }

        
        const [dbResponse,clerkResponse] = await Promise.all([

            //1. Save in db
            await db.user.update({
                where: {clerkId: authUser.id},
                data:{
                    profileImage:cleanURL
                }
            }),

            //2. Save in Clerk (for <UserButton/> Component) 
            clerkClient.users.updateUser(authUser.id,{
                profileImageID: cleanURL
            })
        
            
        ]);

        if(!dbResponse || !clerkResponse){
            return NextResponse.json({message:"Error while setting image in either DB or clerk"},{status:400});
        }

                         

        return NextResponse.json({message:"Profile Image stored in DB & Clerk successfully"},{status:200});
        

    }catch(err){
        console.error("Error while saving profile Image in DB", err);
        return NextResponse.json({message:"Error in the Server"}, {status:500});
    }

}