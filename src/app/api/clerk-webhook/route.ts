import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:Request){

    try{

        const body = await req.json();
        const {id,email_addresses, first_name,image_url} = body?.data;

        const email = email_addresses[0]?.email_address
        console.log("Clerk-Webhook endpiont was called ✅")
        

        await db.user.upsert({
            where: {clerkId: id},
            update:{
                email,
                name:first_name,
                profileImage:image_url
            },
            create:{
                clerkId:id,
                email:email,
                name: first_name,
                profileImage:image_url

            }
        });


        return NextResponse.json({message:"User updated successfully in Database"},{status:200});

    }catch(err){
        console.log(err);
        return NextResponse.json({message:"Internal Server Error"}, {status:500});
    }
}