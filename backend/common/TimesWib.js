function WaktuTimestampCreatedat(){	
	const now = new Date();
	const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000;
	const wibMillis = utcMillis + 7 * 60 * 60 * 1000;
	return new Date(wibMillis);
}


export {
	WaktuTimestampCreatedat
}