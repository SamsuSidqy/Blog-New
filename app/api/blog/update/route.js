import BlogSchema from "@/backend/schema/BlogSchema"
import HandlingFileUpload from "@/backend/common/FileHandling"
import ServicesBlogUpdate from "@/backend/service/UpdateBlog"
import { NextResponse } from 'next/server';
import {getToken as sesi} from "@/lib/@Cookies"
import { v4 } from 'uuid';
import rateLimiter from "@/lib/RateLimiter"


export async function PUT(request,context) {
    try{
        const ip = request.headers.get('x-forwarded-for') || "unknown"
        await rateLimiter.consume(ip)

        const session = await sesi()
        if (!session) {
            return NextResponse.json({status:200, message:"Nahh Were Good Budy"},{ status:200 })
        }

        const formData = await request.formData();

        const file = formData.get('file');
        const slugOld = formData.get('slugOld')

        if (!slugOld) {
            return NextResponse.json({status:400, message:"Slug Required"},{ status:400 })
        }

        const fileName = v4()
        const data = {};


        for (const [key, value] of formData.entries()) {
          if (value instanceof File) continue;
          if (key != "slugOld") {
            data[key] = value;
          }
        }

        data.slug = data.title.replace(/ /g,"-").toLowerCase()   

        if (file) {
            data.media = `${fileName}.${file.name.split('.').pop()}`
            const filesave = await HandlingFileUpload(file,fileName)
        }

        const {error, value} = new BlogSchema().updateSchema.validate(data)

        if (error) {
            return NextResponse.json({status:400,message:error.details.map(e => e.message)},{ status:400 })
        }

        const service = await ServicesBlogUpdate(slugOld,value)
        if (service.status == 200) {
            return NextResponse.json(service,{ status:200 })
        }else{
            return NextResponse.json(service,{ status:500 })
        }
    }catch(err){

        if (err?.msBeforeNext) {
          return NextResponse.json(
            { status: 429, message: "Too Many Requests - Slow down!" },
            { status: 429 }
          );
        }
        
        return NextResponse.json({status:500,message:"Check Api"},{status:500})
    }
}