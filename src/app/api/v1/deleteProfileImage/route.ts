import {NextResponse} from "next/server";
import {v2 as cloudinary} from "cloudinary";
import {db} from "../../../../lib/db";

cloudinary.config({
	
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
});

export async function POST(req: Request){
	try{	

		const {publicId} = await req.json();
		if(!publicId){
			return NextResponse.json({message:"Image URL not found"}, {status:404});

		}

		const splittedId = publicId.split("/");
		const mainPart = splittedId[splittedId.length -1];
		const finalId = mainPart.split(".")[0];		

		const result = await cloudinary.uploader.destroy(finalId, {invalidate:true});

		console.log("cloudinary API result = ", result.result);

		if(result.result=="ok"){
			const user = await db.user.findFirst({});

			if(user){
				await db.user.update({
					where:{id:user.id},
					data:{profileImage:null}
				});
			}

			return NextResponse.json({message:"Profile Image removed successfully"},{status:200});
		}

		
		return NextResponse.json({message:"Cloudinary API error"},{status:400});
		

	}catch(err){
		console.error("Error while deleting image from cloudinary", err);
		return NextResponse.json({message:"Internal Server Error"},{status:500});
	}
}
