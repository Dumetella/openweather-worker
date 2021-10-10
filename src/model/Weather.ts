export type CoordinatesType = {
    lon: number
    lat: number
};

export function CoordinatesEnforcer(obj?: any): CoordinatesType {
    return {
        lon: obj && obj['lon'] || -1,
        lat: obj && obj['lat'] || -1,
    };
}

export type WeatherLocationType = {
    coord: CoordinatesType
    id: number
    name: string
};

export function locationResponseEnforcer(obj?: any): WeatherLocationType {
    return {
        coord: obj && CoordinatesEnforcer(obj['coord']),
        id: obj && obj['id'] || -1,
        name: obj && obj['name'] || '',
    };
}

export function WeatherResponseEnforcer(obj?: any): Weather {
    return {
        weather: obj && obj['weather'] || [],
        main: obj && obj['main'] || {},
        dt: obj && obj['dt'] || -1,
    };
}

export function ForecastResponseEnforcer(obj?: any): Weather[] {
    const list: Weather[] = [];
    if (obj && obj['list'] && Array.isArray(obj['list'])) {
        for (const e of obj['list']) {
            list.push(e);
        }
    }
    return list;
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
