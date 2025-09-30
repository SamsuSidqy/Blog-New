import path from 'path';
import { writeFile } from 'fs/promises';
import { unlink } from 'node:fs';

export async function HandlingFileCdnUpload(files,namefile){
	try{
		const arrayBuffer = await files.arrayBuffer();
    	const buffer = Buffer.from(arrayBuffer);
    	const fileExtension = files.name.split('.').pop();
	    const fileName = `${namefile}.${fileExtension}`;
	    const filePath = path.join(process.env.FOLDERCDN, fileName);
	    await writeFile(filePath, buffer);
	    return fileName
	}catch(err){
		return false
	}
}

export async function HandlingFileCdnDelete(nameFile){
	try{
		const filePath = path.join(process.env.FOLDERCDN, nameFile);
		unlink(filePath,(err) => {
			if (err) { throw errr }
			return true
		})
	}catch(err){
		return false
	}
}