import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import {headers} from "next/headers";


type ClerkUserWebhookEvent = {
    data:{
        id: string;
        email_addresses: {
            email_address: string
        }[];

        first_name: string | null;
        last_name: string | null;
        image_url: string | null;
    };

    object: string;
    type: string;
}
export async function POST(req:NextRequest){

    // WIP: The user is not getting Upsert into the DB.
    try{

        const payload = await req.text(); // raw body
        const headerPayload = await headers();


        if(!process.env.CLERK_WEBHOOK_SECRET){
            console.error("\nCouldn't access Clerk Webhook Secret\n");
            return NextResponse.json({message:"Clerk Webhook Secret couldn't be accessed"}, {status:400});
        }

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const evt = wh.verify(payload,{
            "svix-id": headerPayload.get("svix-id")!,
            "svix-timestamp": headerPayload.get("svix-timestamp")!,
            "svix-signature": headerPayload.get("svix-signature")!,

        }) as ClerkUserWebhookEvent;

        // const body = await req.json();
        const {id,email_addresses, first_name,image_url} = evt.data;

        let email = email_addresses[0]?.email_address

        if(!email){
            email = "";
            console.warn("Test event sent by clerk without any email");
            // return NextResponse.json({message:"Email coudln't be accessed"}, {status:400});
        }

        console.log("Clerk-Webhook endpiont was called ✅")
        

        const dbResponse = await db.user.upsert({
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

        if(!dbResponse){
            console.error("\nDB upsert() error\n");
            return NextResponse.json({message:"Database upsert() error"}, {status:400});
        }

        console.log("\nUser was created successfully ✅\n");

        return NextResponse.json({message:"User updated successfully in Database"},{status:200});

    }catch(err){
        console.log("Error while executing code of /api/clerk-webhook route.ts file",err);
        return NextResponse.json({message:"Internal Server Error"}, {status:500});
    }
}