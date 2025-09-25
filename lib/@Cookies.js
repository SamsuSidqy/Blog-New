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
