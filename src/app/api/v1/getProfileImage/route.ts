import { currentUser} from "@clerk/nextjs/server";
import {db} from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@prisma/client";

export async function GET(req: NextRequest){

    try{

        const authUser: any = await currentUser();

        if(!authUser){
            return NextResponse.json({message:"No authenticated user found by Clerk"},{status: 401});
        }

        const user = await db.user.findFirst({
            where: {clerkId:authUser.id },
        });

        if(!user){
            return NextResponse.json({message:'User not found'},{status:404});
        }

        const profileImageURL =  user.profileImage;

        if(!profileImageURL){
            return NextResponse.json({message:"User has not uploaded any profile image yet."},{status:404});
        }

        return NextResponse.json({message:"Profile Image fetched successfully", url:profileImageURL}, {status:200});

    }catch(err){
        console.error(err);
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }

};
