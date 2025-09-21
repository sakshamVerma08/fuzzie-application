import {NextResponse} from "next/server";
import {v2 as cloudinary} from "cloudinary";
import {db} from "../../../../lib/db";
import { clerkClient, createClerkClient, currentUser } from "@clerk/nextjs/server";
import { nullable } from "zod";

cloudinary.config({
	
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
});

export async function POST(req: Request){
	try{	

		const {publicId} = await req.json();
		const authUser = await currentUser();
		// Instantiating a clerk Client

		const clerkClient = createClerkClient({secretKey: process.env.CLERK_SECRET_KEY});

		if(!authUser){
			return NextResponse.json({message:"Authenticated User doesn't exist on Clerk"}, {status:404});

		}

		if(!publicId){
			return NextResponse.json({message:"Image URL not found"}, {status:404});

		}

		const splittedId = publicId.split("/");
		const mainPart = splittedId[splittedId.length -1];
		const finalId = mainPart.split(".")[0];		

		const result = await cloudinary.uploader.destroy(finalId, {invalidate:true});
		

		console.log("cloudinary API result = ", result.result);

		if(result.result=="ok"){
			
			try{
					const user = await db.user.findFirst({
					where: {clerkId: authUser.id}
				});

			}catch(err){
				console.error("Error while deleting Profile Image from db", err);
				return NextResponse.json({message:"Error while deleting Profile Image from db"}, {status: 400});
			}

				
			try{

				await db.user.update({
						where:{clerkId:authUser.id},
						data:{profileImage:null}
					});
				

			}catch(err){

				console.error("Error while deleting Profile Image from db", err);
				return NextResponse.json({message:"Error while deleting Profile Image from db"}, {status: 400});
			}

			try{
				await clerkClient.users.updateUser(authUser.id,{
					profileImageID: ''
				});
			}catch(err){
				console.error("Error while removing image from Clerk");
				return NextResponse.json({message:"Error while removing image from Clerk"},{status:400});
			}

			return NextResponse.json({message:"Profile Image removed successfully"},{status:200});
		}

		
		try{
			const dbResponse = await db.user.update({
				where:{
					clerkId: authUser.id
				},
				data:{
					profileImage: null
				}
			});

		}catch(err){
			console.error("Error while removing image from DB",err);

			return NextResponse.json({message:"Failed to delete image from DB"},{status:400});
		}

		try{
			await clerkClient.users.updateUser(authUser.id,{
				profileImageID: ''
			});
		}catch(err){
			console.error("Error while removing image from Clerk",err);
			return NextResponse.json({message:"Error while removing image from Clerk"},{status:400});
		}
		
		return NextResponse.json({message:"Image coudln't be removed from cloudinary, but is removed from DB and Clerk"},{status:200});
		

	}catch(err){
		console.error("Error while deleting image from cloudinary", err);
		return NextResponse.json({message:"Internal Server Error"},{status:500});
	}
}
