import express, { response } from 'express';
import dotenv from 'dotenv';
import log4js from 'log4js';
import cors from 'cors';
import WeatherProxy from './components/WeatherProxy.js';
import { locationRequestEnforcer, weatherRequestEnforcer } from './model/InternalRequests.js';
import { DataBase } from './components/DataBase.js';

dotenv.config();

//logger section
const logger = log4js.getLogger();

logger.level = process.env.LOG_LEVEL!;

if (!process.env.LOG_LEVEL) {
    logger.level = 'info';
}
//db

const db = new DataBase();

db.init();

//WeatherProxy
const Weather = new WeatherProxy(process.env.API_KEY!);

//express section
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(cors({
    origin: '*',
}));

app.get('/', async (request, response) => {
    response.send('Hi, i am Dumetella');
});

app.post('/api/v1/location', async (request, response) => {
    const data = locationRequestEnforcer(request.body);
    const res = await Weather.searchLocation(data.city);
    response.send(res);
    response.end();
});

app.post('/api/v1/weather', async (request, response) => {
    const data = weatherRequestEnforcer(request.body);
    const res = await Weather.readWeather(data.locationId);
    db.insertWeather(new Date().getTime(), data.locationId, JSON.stringify(res));
    response.send(res);
    response.end();
});

app.post('/api/v1/forecast', async (request, response) => {
    const data = weatherRequestEnforcer(request.body);
    //check for locationID -1
    const res = await Weather.readForecast(data.locationId);

    response.send(res);

    response.end();
});

const server = app.listen(port, () => console.log(`Running on port ${port}`));

const onProcessSignal = async (signal: NodeJS.Signals) => {
    logger.info('Got signal', signal);
    // db.close((err) => {
    //     if (err) {
    //         logger.error(err.message);
    //     }
    //     logger.info('Closed the database connection.');
    // });
    server.close();
    logger.info('Bye...');
};
process.on('SIGTERM', onProcessSignal);
process.on('SIGINT', onProcessSignal);


