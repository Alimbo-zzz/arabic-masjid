import express from 'express';
import morgan from 'morgan';
import cors from "cors"
import fileUpload from 'express-fileupload';
import { createRequire } from "module";
import {resolve, dirname} from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const fs = require('fs');


const groups = require("./data/groups.json");
const attendance = require("./data/attendance.json");
const persons = require("./data/persons.json");
const data = { attendance, groups, persons };

// vars
const app = express();
const PORT =  2020;

// middlewars
app.use(cors());
app.use(fileUpload()); //позволяет получать formData в запросах
app.use(express.json()); // позволяет читать json в запросах
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :status :res[content-length] :response-time ms')); // выведение в консоль всех запросов


app.get('/getData', (req, res) => {
	try {
		let {type} = req.query;
		if(!data[type]) return res.status(400).message('нет такого ключа')
		return res.status(200).json(data[type]);
	} catch (error) {
		return res.status(404).json({ message: 'error' })
	}
})

app.post('/setData', async (req, res) => {
	try {
		let {type, value} = req.body;
		if(!data[type]) return res.status(400).message('нет такого ключа');
		console.log(type, value)
		await fs.writeFile(resolve(__dirname, `./data/${type}.json`), JSON.stringify(value), (err) => console.log(err) );		
		return res.status(200).json({message: 'Успешно'});
	} catch (error) {
		return res.status(404).json({ message: 'error' })
	}
})




// start server
app.listen(PORT, (err) => {
	if (err) return console.log(err);
	console.log('server started')
	console.log(`link: http://localhost:${PORT}`)
})