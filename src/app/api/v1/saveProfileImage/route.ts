import { NextRequest, NextResponse } from "next/server";
import {db as prisma} from "../../../../lib/db";

export async function POST(req:NextRequest){

    try{

        const {url} = await req.json();

        if(!url){
            return NextResponse.json({message:"The Profile Image URL was not found"},{status:404})
        }

        const image = await prisma.profileImage.findFirst();

        if(image){
            await prisma.profileImage.update({
                where:{id:image.id},
                data:{url}
            });
        }

        else{
            await prisma.profileImage.create({
                data:{url}
            });
        }

        return NextResponse.json({message:"Profile Image stored in DB successfully"},{status:200});


    }catch(err){
        console.error("Error while saving profile Image in DB", err);
        return NextResponse.json({message:"Error in the Server"}, {status:500});
    }

}