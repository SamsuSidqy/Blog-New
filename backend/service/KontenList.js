import BlogModel from "../models/Blog"


export default async function ServicesKontentList(){
	try{
		const model = new BlogModel()
		const results = await model.ListBlogKonten()
		return {
			status:200,
			message:"Blog Berhasil Di Ambil",
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