import mongoose from 'mongoose';


const schemaData = new mongoose.Schema({
	name: {	type: String, required: true },
	data: { type: String, required: true }
}, {timestamps: true})


export const dataCollection = await new mongoose.model("data", schemaData) 
