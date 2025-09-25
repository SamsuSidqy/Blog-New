import { cookies } from 'next/headers';
import EnkripsiAES from '@/lib/EncryptCookie'

export async function CookieValid(){
	try{
		const cookieStore = await cookies();
		const enkcrip = new EnkripsiAES()
	  	
	  	const token = cookieStore.get('user')?.value;
	  	const decrypt = await enkcrip.decryptData(token,process.env.COOKIE_SECRET)
	  	if (decrypt) {
	  		return true
	  	}else{
	  		return false
	  	}
	}catch(er){
		return false
	}
}