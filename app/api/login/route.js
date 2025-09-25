import { NextResponse } from 'next/server';
import EnkripsiAES from '@/lib/EncryptCookie'

export async function GET(request) {
  return NextResponse.json({ message: 'GET request received' }, { status: 200 });
}

export async function POST(request) {
  try {
    // const body = await request.json();
     const enk = new EnkripsiAES()
     const data = {username:"ucup",email:"ucup@example.com"}
     const payload = await enk.EncryptData(JSON.stringify(data),process.env.COOKIE_SECRET)
     const response = new NextResponse('Logged out');
     response.cookies.set('user',payload, {
	  httpOnly: true,
	  path: '/',
	  maxAge: 60 * 60, // 1 hour	
	});

    return response;
  } catch (error) {
    console.error('Failed to parse JSON body:', error);
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }
}
