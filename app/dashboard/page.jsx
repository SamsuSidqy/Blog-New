import { cookies } from 'next/headers'
import { getToken } from '@/lib/@Cookies';
import RichTextExample from './component/Editor'

export default async function Dashboard(){
	const nae = await getToken()
	return(
		<div className="" >
			<RichTextExample />
		</div>
		)
	
}

