import { currentUser} from "@clerk/nextjs/server";
import {db} from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@prisma/client";

export async function GET(req: NextRequest){

    // gotta get the url from DB , check whether it's null or not. If not, then return it at the frontend.
    // If it's null, then return null from here as well.

    // WIP: Use the authUser() , something like this, here, this auth User is gonna come after clerk operations become successful.
    try{

        const authUser: any = await currentUser();

        if(!authUser){
            return NextResponse.json({message:"No authenticated user found by Clerk"},{status: 401});
        }

        const user: User | null = await db.user.findFirst({
            where: {clerkId:authUser.id },
            select:{profileImage:true}
        });

        if(!user){
            return NextResponse.json({message:'User not found'},{status:404});
        }

        const profileImageURL =  user.profileImage;

        if(!profileImageURL){
            return NextResponse.json({message:"User has not uploaded any profile image yet."},{status:404});
        }

        return NextResponse.json({message:"Profile Image fetched successfully", url:profileImageURL}, {status:200},);

    }catch(err){
        console.error(err);
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }

};
