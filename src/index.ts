import express from 'express';
import dotenv from 'dotenv';
import log4js from 'log4js';
import WeatherProxy from './components/weather';


dotenv.config();

const logger = log4js.getLogger();

logger.level = process.env.LOG_LEVEL!;

if (!process.env.LOG_LEVEL) {
    logger.level = 'info';
}

const app = express();
const port = process.env.PORT;

if (!process.env.API_KEY) {
    throw new Error('No api key');
}
const Weather = new WeatherProxy(process.env.API_KEY);


console.log(Weather.searchLocation('Simferopol'));

app.get('/', (request, response) => {
    response.send('Hello world!');
});

app.listen(port, () => console.log(`Running on port ${port}`));

const onProcessSignal = async (signal: NodeJS.Signals) => {
    logger.info('Got signal', signal);
    logger.info('Bye...');
};
process.on('SIGTERM', onProcessSignal);
process.on('SIGINT', onProcessSignal);
