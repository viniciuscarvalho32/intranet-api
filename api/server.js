const express = require('express')
//import express from 'express';
const app = new express();
const bodyParser = require('body-parser')
//import bodyParser from 'body-parser';
const cors = require('cors')
//import cors from 'cors';
const soap = require('soap')
//import soap from 'soap';
const routes = require('./controllers/routes.js')
//import { routes } from './controllers/routes.js';
const mongoose = require('mongoose')
//import mongoose from 'mongoose';
const cookieParser = require('cookie-parser');
require("dotenv/config");
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());
app.use(routes);
app.use(cookieParser(process.env.SECRET))
app.use((req,res,next) => {
    const token = req.signedCookies["meuToken"]
    req.headers.authorization = token; //aqui adicionamos o token ao cabecario da requisicao
    next();
})

const connectionString = process.env.DB_CONEXAO;

mongoose.connect(connectionString)
    .then(() => {
        app.listen(3000)
        console.log('Conectou ao banco!')
    })
    .catch((err) => console.log(err))



