import express from 'express';
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

app.use(cors());

const Weather = new WeatherProxy(process.env.API_KEY!);

app.get('/location', async (request, response) => {
    const data = await request.body;
    response.end();
});

app.get('/weather', async (request, response) => {
    const data = await request.body;
    response.send('Hello world!');
});

const server = app.listen(port, () => console.log(`Running on port ${port}`));

const onProcessSignal = async (signal: NodeJS.Signals) => {
    logger.info('Got signal', signal);
    await server.close();
    logger.info('Bye...');
};
process.on('SIGTERM', onProcessSignal);
process.on('SIGINT', onProcessSignal);
