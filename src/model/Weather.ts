
export class Coordinates {
    public lon: number;
    public lat: number;
    
    constructor(obj?: any) {
        this.lon = obj && obj['lon'] || -1;
        this.lat = obj && obj['lat'] || -1;        
    }
}

export class WeatherLocation {
    public coord: Coordinates;
    public id: number;
    public name: string;
    constructor(obj?: any) {
        this.coord = obj && new Coordinates(obj['coord']);
        this.id = obj && obj['id'] || -1;
        this.name = obj && obj['name'] || '';
    }
}

export interface WeatherConditions {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface MainWeatherData {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}

export interface Weather {
    weather: WeatherConditions[];
    main: MainWeatherData;
    dt: number;
}
