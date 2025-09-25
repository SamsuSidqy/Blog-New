import Joi from 'joi'
import { WaktuTimestampCreatedat } from '../common/TimesWib.js'

export default class BlogSchema{
	schema = Joi.object({
		title: Joi.string().max(100).required(),
		body : Joi.string().required(),
		slug : Joi.string(),
		tagline : Joi.custom((val, helper) => {
			return val.replace(/ /g,"").split("#").slice(1)
		}),
		media: Joi.string(),		
		created_at: Joi.date().iso().default(WaktuTimestampCreatedat().toISOString()),			
	})
}