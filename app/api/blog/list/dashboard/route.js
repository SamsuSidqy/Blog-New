import ServicesDashboardList from "@/backend/service/DashboardList"
import { NextResponse } from 'next/server';
import {getToken as sesi} from "@/lib/@Cookies"

export async function GET(request,response) {
	const session = await sesi()
	if (!session) {
		return NextResponse.json({status:200, message:"Nahh Were Good Budy", data:[]},{ status:200 })
	}

	const serv = await ServicesDashboardList()
	return NextResponse.json(serv,{ status:serv.status })
}