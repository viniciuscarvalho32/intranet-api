import express from 'express';
const app = new express();
import bodyParser from 'body-parser';
import cors from 'cors';

//import util from 'util';
//import handlebars from 'express-handlebars';
//import stringify from 'querystring';
//import request from 'http';

import { routes } from './controllers/routes.js';
/*
import { MongoClient } from 'mongodb';
import { mongoose } from 'mongoose';

const uri = "mongodb://localhost:27017"
*/
//app.engine('handlebars', handlebars({defaultLayout: 'main'}));
//app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(cors());
app.use(routes)
app.listen(3000);



