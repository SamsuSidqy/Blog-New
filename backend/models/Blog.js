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
}
