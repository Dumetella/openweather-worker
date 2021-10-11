import express, { response } from 'express';
import dotenv from 'dotenv';
import log4js from 'log4js';
import cors from 'cors';
import WeatherProxy from './components/weather.js';

dotenv.config();

const logger = log4js.getLogger();

logger.level = process.env.LOG_LEVEL!;

if (!process.env.LOG_LEVEL) {
    logger.level = 'info';
}

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(cors({
    origin: '*',
}));

const Weather = new WeatherProxy(process.env.API_KEY!);

app.get('/', async (request, response) => {
    response.send('Hello world!');
});

app.post('/location', async (request, response) => {
    const data = await request.body;
    const city = data.location;
    logger.info(city);
    const res = await Weather.searchLocation(city);
    logger.info(res);
    response.send(res);
    response.end();
});

const server = app.listen(port, () => console.log(`Running on port ${port}`));

const onProcessSignal = async (signal: NodeJS.Signals) => {
    logger.info('Got signal', signal);
    await server.close();
    logger.info('Bye...');
};
process.on('SIGTERM', onProcessSignal);
process.on('SIGINT', onProcessSignal);

