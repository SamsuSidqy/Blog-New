import path from 'path';
import { writeFile } from 'fs/promises';

export default async function HandlingFileUpload(files,namefile){
	try{
		const arrayBuffer = await files.arrayBuffer();
    	const buffer = Buffer.from(arrayBuffer);
    	const fileExtension = files.name.split('.').pop();
	    const fileName = `${namefile}.${fileExtension}`;
	    const filePath = path.join(process.env.FILEUPLOAD, fileName);
	    await writeFile(filePath, buffer);
	    return fileName
	}catch(err){
		return false
	}
}