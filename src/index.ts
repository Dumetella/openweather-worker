import express from 'express';
import dotenv from 'dotenv';
import log4js from 'log4js';
import cors from 'cors';
import WeatherProxy from './components/WeatherProxy.js';
import { locationRequestEnforcer, weatherRequestEnforcer } from './model/InternalRequests.js';
import { DataBase } from './components/DataBase.js';

dotenv.config();

//logger section
const logger = log4js.getLogger();

if (!process.env.LOG_LEVEL) {
    logger.level = 'info';
}

logger.level = process.env.LOG_LEVEL;

//db

const db = new DataBase();

db.init();

//WeatherProxy
if (!process.env.API_KEY) {
    throw new Error('No OpenWeatherMap API_KEY specified');
}

const Weather = new WeatherProxy(process.env.API_KEY);

//express section
const app = express();

if (!process.env.PORT) {
    throw new Error('No server port specified');
}

const port = process.env.PORT;

app.use(express.json());

app.use(cors({
    origin: '*',
}));

app.post('/api/v1/location', async (request, response) => {
    const data = locationRequestEnforcer(request.body);
    //TODO error clas and send error
    if (!data.city) {
        response.status(404);
        response.end();
        return;
    }
    const res = await Weather.searchLocation(data.city);
    if (!res.name) {
        response.status(404);
        response.end();
        return;
    }
    response.send(res);
    response.end();
});

app.post('/api/v1/weather', async (request, response) => {
    const data = weatherRequestEnforcer(request.body);
    //TODO Error class and send error
    if (data.locationId === -1) {
        response.status(404);
        response.end();
        return;
    }
    let res = await db.getWeather(data.locationId);
    if (!res) {
        res = await Weather.readWeather(data.locationId);
        db.insertWeather(new Date().getTime(), data.locationId, JSON.stringify(res));
    }
    response.send(res);
    response.end();
});

app.post('/api/v1/forecast', async (request, response) => {
    const data = weatherRequestEnforcer(request.body);
    //TODO Error class and send error
    if (data.locationId === -1) {
        response.status(404);
        response.end();
        return;
    }
    let res = await db.getForecast(data.locationId);
    if (!res) {
        res = await Weather.readForecast(data.locationId);
        db.insertForecast(new Date().getTime(), data.locationId, JSON.stringify(res));
    }
    response.send(res);
    response.end();
});

const server = app.listen(port, () => logger.info(`Running on port ${port}`));

const onProcessSignal = async (signal: NodeJS.Signals) => {
    logger.info('Got signal', signal);
    await db.close();
    server.close();
    logger.info('Bye...');
};
process.on('SIGTERM', onProcessSignal);
process.on('SIGINT', onProcessSignal);
