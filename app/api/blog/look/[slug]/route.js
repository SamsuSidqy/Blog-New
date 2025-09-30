import ServicesLookBlog from "@/backend/service/LookBlog"
import { NextResponse } from 'next/server';
import rateLimiter from "@/lib/RateLimiterAnonym"

export async function GET(req,context){
	try{
		const params = await context.params;  // <-- await here
    	const { slug } = params;
    	const serv = await ServicesLookBlog(slug)    	
		return NextResponse.json(serv,{status:200})
	}catch(err){
		return NextResponse.json({status:500,message:"Kesalahan Server"},{status:500})
	}
}