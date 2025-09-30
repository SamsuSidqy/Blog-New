import { readdir, stat } from 'node:fs/promises';
import { NextResponse } from 'next/server';
import {getToken as sesi} from "@/lib/@Cookies"
import { HandlingFileCdnUpload, HandlingFileCdnDelete } from "@/backend/common/FileCdnHandling"
import rateLimiter from "@/lib/RateLimiter"
import { v4 } from 'uuid';
export async function GET(req){
	
	try{
		const ip = req.headers.get('x-forwarded-for') || "unknown"
		await rateLimiter.consume(ip)
		const session = await sesi()
        if (!session) {
            return NextResponse.json({status:200, message:"Nahh Were Good Budy"},{ status:200 })
        }

		const folder = await readdir(process.env.FOLDERCDN)
		const dataFile = []
		const bln = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
		for(const data of folder){
			const filess = await stat(`${process.env.FOLDERCDN}/${data}`)
			const tgl = new Date(filess.ctimeMs)
			dataFile.push({
				name : data,
				created_at : `${tgl.getDate()} ${bln[tgl.getMonth()]} ${tgl.getFullYear()}, ${tgl.getHours()}:${tgl.getMinutes()}`
			})
		}
		return NextResponse.json({ status:200, dataFile })
	}catch(err){		
		if (err?.msBeforeNext) {
	      return NextResponse.json(
	        { status: 429, message: "Too Many Requests - Slow down!" },
	        { status: 429 }
	      );
	    }
		return NextResponse.json({ status:500, message:"Check Api" },{ status:500 })
	}
}

export async function POST(req){
	try{
		const ip = req.headers.get('x-forwarded-for') || "unknown"
		await rateLimiter.consume(ip)
		const session = await sesi()
        if (!session) {
            return NextResponse.json({status:200, message:"Nahh Were Good Budy"},{ status:200 })
        }

		const formData = await req.formData();
		const files = formData.get('file')
		if (!files) {
			return NextResponse.json({status:400, message:"Where Your Files"},{ status:400 })
		}
		await HandlingFileCdnUpload(files,v4())
		return NextResponse.json({ status:200 },{ status:200 })
	}catch(err){
		console.log(err)
		if (err?.msBeforeNext) {
	      return NextResponse.json(
	        { status: 429, message: "Too Many Requests - Slow down!" },
	        { status: 429 }
	      );
	    }
		return NextResponse.json({ status:500, message:"Check Api" },{ status:500 })
	}
}

export async function DELETE(req){
	try{
		const ip = req.headers.get('x-forwarded-for') || "unknown"
		await rateLimiter.consume(ip)
		const session = await sesi()
        if (!session) {
            return NextResponse.json({status:200, message:"Nahh Were Good Budy"},{ status:200 })
        }
        const data = await req.json()
        
        if (data) {
        	await HandlingFileCdnDelete(data.files)
        	return NextResponse.json({status:200, message:"Deleted Success"},{ status:200 })
        }

        return NextResponse.json({status:200, message:"Nahh Were Good Budy"},{ status:200 })

	}catch(err){
		if (err?.msBeforeNext) {
	      return NextResponse.json(
	        { status: 429, message: "Too Many Requests - Slow down!" },
	        { status: 429 }
	      );
	    }
		return NextResponse.json({ status:500, message:"Check Api" },{ status:500 })
	}
}