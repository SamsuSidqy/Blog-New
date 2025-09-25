import BlogSchema from "@/backend/schema/BlogSchema"
import HandlingFileUpload from "@/backend/common/FileHandling"
import ServicesBlogCreate from "@/backend/service/CreateBlog"
import { NextResponse } from 'next/server';
import {getToken as sesi} from "@/lib/@Cookies"
import { v4 } from 'uuid';

export async function POST(request,response) {
	const session = await sesi()
	if (!session) {
		return NextResponse.json({status:200, message:"Nahh Were Good Budy"},{ status:200 })
	}
	const formData = await request.formData();

    const file = formData.get('file');
    if (!file || typeof file === "string") {
    	return NextResponse.json({status:400,message:"Unknown Files"},{ status:400 })
    }

    const fileName = v4()
    const data = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) continue;
      data[key] = value;
    }
    data.media = `${fileName}.${file.name.split('.').pop()}` 
    data.slug = data.title.replace(/ /g,"-").toLowerCase()   
    const {error, value} = new BlogSchema().schema.validate(data)

    if (error) {
    	return NextResponse.json(error.details.map(e => e.message),{ status:400 })
    }
    

    const filesave = await HandlingFileUpload(file,fileName)
    const service = await ServicesBlogCreate(value)
    if (service.status == 200) {
    	return NextResponse.json(service,{ status:200 })
    }else{
    	return NextResponse.json(service,{ status:500 })
    }
}