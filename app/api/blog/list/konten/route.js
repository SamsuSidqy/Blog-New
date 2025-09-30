import ServicesKontentList from "@/backend/service/KontenList"
import { NextResponse } from 'next/server';
import {getToken as sesi} from "@/lib/@Cookies"
import rateLimiter from "@/lib/RateLimiterAnonym"

export async function GET(request,response) {
	try{
		const ip = request.headers.get('x-forwarded-for') || "unknown"
		await rateLimiter.consume(ip)		

		const serv = await ServicesKontentList()
		return NextResponse.json(serv,{ status:serv.status })
	}catch(err){
		if (err?.msBeforeNext) {
	      return NextResponse.json(
	        { status: 429, message: "Too Many Requests - Slow down!" },
	        { status: 429 }
	      );
	    }
	    return NextResponse.json(
	        { status: 500, message: "Kesalahan Di Server" },
	        { status: 500 }
	     );
	}
}