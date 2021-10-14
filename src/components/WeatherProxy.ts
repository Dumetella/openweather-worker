import { Weather, locationResponseEnforcer, WeatherLocationType, forecastResponseEnforcer, weatherResponseEnforcer } from '../model/WeatherRequests.js';
import fetch, { Response } from 'node-fetch';

export default class WeatherProxy {
    private server: string;
    private defaultParams: queryParams;

    constructor(apiKey: string) {
        this.defaultParams = {
            appid: apiKey,
        };
        this.server = 'http://api.openweathermap.org/data/2.5';
    }

    public async searchLocation(term: string): Promise<WeatherLocationType> {

        const result = await this.makeRequest('weather', {
            q: term,
        });

        return locationResponseEnforcer(await result.json());
    }

    public async readWeather(locationId: number): Promise<Weather> {

        const current = await this.makeRequest('weather', {
            id: locationId,
            units: 'metrics'
        });

        return weatherResponseEnforcer(await current.json());
    }

    public async readForecast(locationId: number): Promise<Weather[]> {

        const forecast = await this.makeRequest('forecast', {
            id: locationId,
            units: 'metrics',
            cnt: 8,
        });

        return forecastResponseEnforcer(await forecast.json());
    }

    public getIconUrl(code: string): string {
        return `http://openweathermap.org/img/wn/${code}.png`;
    }

    private async makeRequest(endpoint: string, params: queryParams): Promise<Response> {
        const queryParams = { ...this.defaultParams, ...params };

        const q = Object.keys(queryParams).map(c => `${c}=${queryParams[c]}`).join('&');
        const resp = await fetch(`${this.server}/${endpoint}?${q}`);

        if (!resp.ok) {
            throw new Error(`Failed to get ${endpoint}(${q})`);
        }

        return resp;
    }
}

type queryParams = {
    [key: string]: string | number,
};
