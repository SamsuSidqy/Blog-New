import BlogModel from "../models/Blog"


export default async function ServicesBlogUpdate(slug,data){
	try{
		console.log(slug)
		console.log(data)
		const model = new BlogModel()
		const results = await model.UpdateBlogData(slug,data)
		return {
			status:200,
			message:results.modifiedCount > 0 ? "Blog Berhasil Di Update": "Tidak Ada Yang Di Update"
		}
	}catch(err){
		console.log(err)
		return{
			status:500,
			message:"Kesalahan Dalam Server."
		}
	}
}