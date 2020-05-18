import {indexRouter, fetchServiceUrl} from "./routes/index.mjs";
import express from "express";
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import {alertsRouter} from "./routes/alerts.mjs";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// var usersRouter = require('./routes/users');
// let locationRouter = require('./routes/locations');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/common')));

app.use('/', indexRouter);
app.use('/alerts', alertsRouter);
// app.use('/users', usersRouter);
// app.use('/locations', locationRouter);

fetchServiceUrl();

app.listen(80, function () {
    console.log('Example app listening on port 80!');
});