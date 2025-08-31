import { NextRequest, NextResponse } from "next/server";
import {db} from "../../../../lib/db";

export async function POST(req:NextRequest){

    try{

        const {url} = await req.json();

        if(!url){
            return NextResponse.json({message:"The Profile Image URL was not found"},{status:404})
        }

        const cleanURL = url.replace(/"/g, '');// Remove any extra quotes ("") because they get encoded as %22, then it gives
        // issues when fetching the image from Cloudinary     

        const user = await db.user.findFirst();


        if(user){
            await db.user.update({
                where:{id:user.id},
                data:{profileImage:cleanURL}
            });

        }
        else{
            // For now, just create a dummy user
            await db.user.create({
                data:{
                    clerkId:"DummyID",
                    email:"Dummy1@gmail.com",
                    name:"Dummy User",
                    profileImage:cleanURL
                }
            });
        }

                

        return NextResponse.json({message:"Profile Image stored in DB successfully"},{status:200});


    }catch(err){
        console.error("Error while saving profile Image in DB", err);
        return NextResponse.json({message:"Error in the Server"}, {status:500});
    }

}