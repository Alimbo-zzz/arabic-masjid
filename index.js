import express from 'express';
import morgan from 'morgan';
import cors from "cors"
import fileUpload from 'express-fileupload';
import { createRequire } from "module";
import {resolve, dirname} from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const fs = require('fs');
import { dataCollection } from './schemes.js';

	
const db_url = "mongodb+srv://alimbo333:al886612345@cluster0.qakuqr0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const db = mongoose.connect(db_url);
db.then(res => console.log("db connected"))
	.catch(err => console.log(err))


// vars
const app = express();
const PORT =  2020;

// middlewars
app.use(cors());
app.use(fileUpload()); //позволяет получать formData в запросах
app.use(express.json()); // позволяет читать json в запросах
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :status :res[content-length] :response-time ms')); // выведение в консоль всех запросов



app.get('/getData', async (req, res) => {
	try {
		let {type} = req.query;
		let {data} = await dataCollection.findOne({name: type})
		if(!data) return res.status(400).message('нет такого ключа');
		return res.status(200).json(JSON.parse(data));
	} catch (error) {
		return res.status(404).json({ message: 'error' })
	}
})

app.post('/setData', async (req, res) => {
	try {
		let {type, value} = req.body;
		let findItem = await dataCollection.updateOne({name: type}, {data: JSON.stringify(value)})
		if(!findItem) return res.status(400).message('нет такого ключа');
		return res.status(200).json({message: "успешно"});
	} catch (error) {
		console.log(error)
		return res.status(404).json({ message: 'error' })
	}
})




// start server
app.listen(PORT, (err) => {
	if (err) return console.log(err);
	console.log('server started')
	console.log(`link: http://localhost:${PORT}`)
})