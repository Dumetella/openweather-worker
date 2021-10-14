export type LocationRequest = {
    city: string
};

export type WeatherRequest = {
    locationId: number
};

export function locationRequestEnforcer(obj?: any): LocationRequest {
    return {
        city: obj && obj['city'] || '',
    };
}

export function weatherRequestEnforcer(obj?: any): WeatherRequest {
    return {
        locationId: obj && obj['locationId'] || -1,
    };
}
