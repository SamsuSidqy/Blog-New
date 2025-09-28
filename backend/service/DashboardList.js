import BlogModel from "../models/Blog"


export default async function ServicesDashboardList(){
	try{
		const model = new BlogModel()
		const results = await model.ListBlogDashboard()
		return {
			status:200,
			message:"Blog Berhasil Di Buat",
			data:results
		}
	}catch(err){
		return{
			status:500,
			message:"Kesalahan Dalam Server.",
			data:[]
		}
	}
}