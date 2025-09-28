"use server"

import { cookies } from 'next/headers';
import EnkripsiAES from '@/lib/EncryptCookie'
export async function getToken() {
	try{

		const enkcrip = new EnkripsiAES()

	  	const cookieStore = await cookies();
	  	const token = cookieStore?.get('user')?.value;

	  	const decrypt = await enkcrip.decryptData(token,process.env.COOKIE_SECRET)

	  	return JSON.parse(decrypt);
	}catch(err){
		return null
	}
}


export async function logoutUsers() {
	try{
	  	const cookieStore = await cookies();
	  	cookieStore?.set({
	  		name:"user",
	  		value:"",
	  		httpOnly:true,
	  		path:"/",
	  		maxAge:0
	  	})
	  	return true
	}catch(err){
		console.log(err)
		return null
	}
}


