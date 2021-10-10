import { WeatherLocation, Weather } from '../model/Weather';

export default class WeatherProxy {

    private api_key: string | undefined;
    private keyQuery: string;
    private server: string;

    constructor() {
        this.api_key = process.env.API_KEY;
        if (this.api_key === undefined) {
            throw new Error('No Open Weather API Key defined');
        }
        this.keyQuery = `appid=${this.api_key}`;
        this.server = 'http://api.openweathermap.org/data/2.5';
    }

    public async searchLocation(term: string): Promise<WeatherLocation | undefined> {

        const result = await fetch(`${this.server}/weather?q=${term}&${this.keyQuery}`);

        if (result.status === 404) return undefined;
        if (result.status !== 200) throw new Error('Failed to read location data');

        return await result.json();
    }

    public async readWeather(locationId: number): Promise<Weather> {

        const current = await fetch(`${this.server}/weather?id=${locationId}&${this.keyQuery}&units=metric`);

        if (current.status !== 200) throw new Error('Failed to read location data');

        return await current.json();
    }

    public async readForecast(locationId: number): Promise<Weather[]> {

        const forecast = await fetch(`${this.server}/forecast?id=${locationId}&${this.keyQuery}&units=metric&cnt=8`);

        if (forecast.status !== 200) throw new Error('Failed to read location data');

        return (await forecast.json()).list;
    }

    public getIconUrl(code: string): string {
        return `http://openweathermap.org/img/wn/${code}.png`;
    }
}






