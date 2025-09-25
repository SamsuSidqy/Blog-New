import BlogModel from "../models/Blog"


export default async function ServicesBlogCreate(data){
	try{
		const model = new BlogModel()
		const results = await model.CreateBlog(data)
		return {
			status:200,
			message:"Blog Berhasil Di Buat"
		}
	}catch(err){
		return{
			status:500,
			message:"Kesalahan Dalam Server."
		}
	}
}