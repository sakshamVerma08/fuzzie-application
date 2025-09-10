import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import {headers} from "next/headers";
import { EthernetPort } from "lucide-react";
import { nextImageLoaderRegex } from "next/dist/build/webpack-config";


function parseClerkTimestamp(ts: unknown): Date | null | undefined {

    if(ts == null) return null;

    if (typeof ts === "number"){
        return new Date(ts > 1e12? ts: ts * 1000);
    }

    if(typeof ts === "string"){
        const n = Number(ts);

        if(!Number.isNaN(n)){
            return new Date(n > 1e12 ? n : n*1000);
        }

        const d = new Date(ts);

        return isNaN(d.getTime()) ? null : d;
    }
}

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
                const {id, email_addresses,first_name,last_name,image_url} = evt.data;

                let email = email_addresses[0].email_address;

                try{
                    
                    const dbResponse = await db.user.upsert({
                    where: {clerkId: id},
                    update:{
                        name: `${first_name ?? ' '} ${last_name ?? ''}`,

                        email: email,
                        profileImage: image_url,
                    }, 

                    create: {

                        clerkId: id,
                        name: `${first_name?? ' '} ${last_name ?? ' '}`,
                        email: email,
                        profileImage: image_url

                    }
                    
                });

            }catch(err){
                console.error("Error while Signing Up the user", err);
            }

                console.log("A new user was created in DB successfully ✅");
                break;
                
            }


            case "user.updated":{

                console.warn("\nUser.updated Event was called\n");

                // const body = await req.json();
                const {id,email_addresses, first_name,image_url} = evt.data;

                let email = email_addresses[0]?.email_address;

                console.log("Clerk-Webhook endpiont was called ✅")
                

                try{
                    const dbResponse = await db.user.update({
                    where: { clerkId: id },
                    data: {
                        email,
                        name: first_name,
                        profileImage: image_url
                    },
                });
                }catch(err){
                    console.error("Error while updating user Info", err);
                }

            console.log("\nUser was created successfully ✅\n");
            break;
            // return NextResponse.json({message:"User updated successfully in Database"},{status:200});
                
                }

            
            case "user.deleted":{

                console.warn("\nUser.deleted event is fired\n");
                const {clerkId} = evt.data;
                // When i manually delete a user form my Clerk Dashboard, then this will be executed.

                try{

                    await db.$transaction( async (tx)=>{

                            await tx.session.deleteMany({
                                where:{clerkUserId: clerkId}
                            });

                            await tx.localGoogleCredential.deleteMany({
                                where: {id: clerkId}
                            });

                            await tx.discordWebhook.deleteMany({
                                where: {id:clerkId}
                            });

                            await tx.slack.deleteMany({
                                where: {id: clerkId}
                            });

                            await tx.notion.deleteMany({
                                where: {id: clerkId}
                            });

                            await tx.connections.deleteMany({
                                where:{id: clerkId}
                            });

                            await tx.workflows.deleteMany({
                                where: {id: clerkId}
                            });
                        })

                        await db.user.deleteMany({
                            where: {clerkId: clerkId}
                        });

                        console.log("\nAll User related Info was wiped off from the DB✅");

                    }catch(err){
                        console.error("Error while deleting data from DB (while removing user from Clerk Dashboard manually", err);
                    }
            }

            // NOTE: There is no way i can guarantee that the user.created event get's executed before the session.created
            // event because clerk webhooks are asynchronous http requests. I do not want to mix up the logic of creating a 
            // new user every time the 'session.created' event fires up, because then i will face the 'Unique Constraint //
            // Error' that i was facing previously. So when this throws an error, it's not an error in my logic, it's a 
            //basic nature of Webhooks


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

                const maxRetries = 5;
                const retryDelayMs = 1000;

                for (let attempt = 0; attempt < maxRetries; attempt ++){

                    try{

                        
                        await db.session.upsert({
                            where: {clerkSessionId},
                            update:{ 
                                status: status?? "active",
                                lastActiveAt: new Date(last_active_at),
                                expireAt: new Date(expire_at),
                                updatedAt:new Date(updated_at),
                                publicMetadata: public_metadata ?? {}
                            },
                            create:{
                                clerkSessionId,
                                clerkUserId,
                                status: status ?? "active",
                                lastActiveAt: new Date(last_active_at * 1000),
                                expireAt: new Date(expire_at * 1000),
                                createdAt: new Date(created_at * 1000),
                                updatedAt: new Date(updated_at * 1000),
                                publicMetadata: public_metadata ?? {}
                            }
                        });
                        
                    }catch(err: any){
                        if(err.code === 'P2003'){

                            if(attempt < maxRetries-1){
                                await new Promise(res=>setTimeout(res,retryDelayMs));
                            }

                            else{
                                console.error("Failed to upsert session after multiple retries.", err);
                                throw err;
                            }
                        }
                        console.error("Error while Signing in (session.created) event", err);

                    }   

                    
            }
                break;

            }
             

            case "session.ended":{

                console.warn("\n Session.ended event was called\n");

                let {id: clerkSessionId, updated_at} = evt.data;
                updated_at = parseClerkTimestamp(updated_at);

                try{

                    await db.session.updateMany({
                        where:{clerkSessionId},
                        data:{
                            status: "expired",
                            updatedAt:new Date(updated_at),
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

            return NextResponse.json({message:"Auth Successful"},{status:200});

        }
        
        catch(err){
        console.log("Error while executing code of /api/clerk-webhook route.ts file",err);
        return NextResponse.json({message:"Internal Server Error"}, {status:500});
    }
}  