import Connection from '../connection/MongoDb'
import { ObjectId } from 'mongodb'

export default class BlogModel{
	async #Database(){
		try{
			const connect = await Connection()
			return connect.collection('blogging')
		}catch(e){
			return null
		}
	}

	async CreateBlog(data){
		try{
			const db = await this.#Database()
			const results = await db.insertOne(data)
			return results
		}catch(er){
			throw new Error(er)
		}
	}


	async ListBlogDashboard(){
		try{
			const db = await this.#Database()
			const results = await db.find().toArray()
			return results
		}catch(err){
			throw new Error(err)
		}
	}

	async ListBlogKonten(){
		try{
			const db = await this.#Database()
			const results = await db.find().sort({ createdAt: -1 }).toArray()
			return results
		}catch(err){
			throw new Error(err)
		}
	}

	async UpdateBlogData(slug,data){
		try{
			const db = await this.#Database()
			const results = await db.updateOne({
				slug:slug
			},{$set:data})			
			return results
		}catch(err){
			throw new Error(err)
		}
	}
	async LookBlog(slug){
		try{
			const db = await this.#Database()
			const results = await db.findOne({slug:slug})
			return results
		}catch(err){
			throw new Error(err)
		}
	}
}
