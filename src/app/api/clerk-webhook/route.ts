import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import {headers} from "next/headers";
import { EthernetPort } from "lucide-react";
import { nextImageLoaderRegex } from "next/dist/build/webpack-config";


// type ClerkUserWebhookEvent = {
//     data:{
//         id: string;
//         email_addresses: {
//             email_address: string
//         }[];

//         first_name: string | null;
//         last_name: string | null;
//         image_url: string | null;
//     };

//     object: string;
//     type: string;
// }


type ClerkUserWebhookEvent = {
    data: any;

    object: string;
    type: string;
}
export async function POST(req:NextRequest){

    // WIP: I've gotta handle the session.created &  session.ended events as well. So i've put a switch() case logic.
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


        // Switching event handling logic on the basis of what event triggered the webhook.

        switch(evt.type){

            case "user.created":{

                console.warn("\nUser.created event was called\n");
                const {id, email_addresses,first_name,image_url} = evt.data;

                let email = email_addresses[0]?.email_address;

                const dbResponse = await db.user.create({
                    data:{
                        clerkId: id,
                        email: email,
                        name: first_name,
                        profileImage: image_url
                    }
                });

                if(!dbResponse){
                   throw new Error("Error while creating a new user in DB");
                }

                console.log("A new user was created in DB successfully ✅");
            }

            
            case "user.updated":{

                console.warn("\nUser.updated Event was called\n");

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
                    // console.error("\nDB upsert() error\n");
                    // return NextResponse.json({message:"Database upsert() error"}, {status:200});
                    throw new Error("Error while upserting a new user to the DB");
                }

                console.log("\nUser was created successfully ✅\n");
                break;
                // return NextResponse.json({message:"User updated successfully in Database"},{status:200});
                
                }


            case "session.created":{
                 
                console.warn("\nSession.created Event was called \n");

                const {

                    id: clerkSessionId,
                    user_id: clerkUserId,
                    status,
                    last_active_at,
                    expire_at,
                    created_at,
                    updated_at,
                    public_metadata,

                } = evt.data;


                try{

                    // Ensuring that the User entry which is associated with the Foreign Key in Session ID table exists, so 
                    // prisma doen't throw a FK error.
                    /*await db.user.upsert({
                        where: {clerkId: clerkUserId},
                        update:{},
                        create:{
                            clerkId: clerkUserId, 
                            email: "",
                            name: null,
                            profileImage: null,
                        }
                    });
                    */

                    await db.session.create({
                        data:{
                            clerkSessionId,
                            clerkUserId,
                            status: status?? "active",
                            lastActiveAt: new Date(last_active_at),
                            expireAt: new Date(expire_at),
                            createdAt: created_at? new Date(created_at): new Date(),
                            updatedAt:updated_at? new Date(updated_at): new Date(),
                            publicMetadata: public_metadata ?? {}
                        },
                    });
                    
                }catch(err){
                    console.error("Error while Signing in (session.created) event", err);

                }   

                break;
                
            }


            case "session.ended":{

                console.warn("\n Session.ended event was called\n");

                const {id: clerkSessionId, updated_at} = evt.data;


                try{

                    await db.session.updateMany({
                        where:{clerkSessionId},
                        data:{
                            status: "expired",
                            updatedAt: updated_at ?? new Date(updated_at),
                        }
                    });


                
                }catch(err){
                    console.error("Error while ending the session (session.ended) event", err);

                }

                break;
            }

            default: {
                console.warn("\nUnhandled Event Type: ",evt.type);
            }
                
        }

        return NextResponse.json({message:"Event handled Gracefully"}, {status:200});

        

    }catch(err){
        console.log("Error while executing code of /api/clerk-webhook route.ts file",err);
        return NextResponse.json({message:"Internal Server Error"}, {status:500});
    }
}  