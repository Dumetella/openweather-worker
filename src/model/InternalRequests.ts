export type LocationRequest = {
    city: string
};

export type WeatherRequest = {
    locationId: number
};

export function locationRequestEnforcer(obj?: unknown): LocationRequest {
    return {
        city: obj && obj['city'] || '',
    };
}

export function weatherRequestEnforcer(obj?: unknown): WeatherRequest {
    return {
        locationId: obj && obj['locationId'] || -1,
    };
}
