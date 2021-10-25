import { Weather } from 'src/model/WeatherRequests.js';
import appDAO from './appDAO.js';

class DataBase {
    private dao: appDAO;
    constructor() {
        this.dao = new appDAO();
    }

    public async init(): Promise<void> {

        const drop = `
        DROP TABLE Weather
        `

        const drop2 = `
        DROP TABLE Forecast
        `

        const create = `
        CREATE TABLE IF NOT EXISTS Weather
        (
        Time INTEGER,
        LocationID INTEGER,
        Data TEXT
        )`;

        const create2 = `
        CREATE TABLE IF NOT EXISTS Forecast
        (
        Time INTEGER,
        LocationID INTEGER,
        Data TEXT
        )`;

        await this.dao.run(drop)
        await this.dao.run(drop2)
        await this.dao.run(create);
        await this.dao.run(create2);
    }

    public async insertWeather(time: number, id: number, data: string): Promise<void> {
        await this.dao.run(
            'INSERT INTO Weather(Time, LocationID, Data) VALUES(:time, :locationid, :data)',
            {
                ':time': time,
                ':locationid': id,
                ':data': data
            }
        );
    }

    public async insertForecast(time: number, id: number, data: string): Promise<void> {
        await this.dao.run(
            'INSERT INTO Forecast(Time, LocationID, Data) VALUES(:time, :locationid, :data)',
            {
                ':time': time,
                ':locationid': id,
                ':data': data
            }
        );
    }
    public async getWeather(id: number): Promise<Weather | undefined> {
        const res = await this.dao.get(
            'SELECT Data FROM Weather WHERE LocationID = :id AND Time > :time',
            {
                ':id': id,
                ':time': new Date().getTime() - 1000 * 60 * 60,
            }
        );
        return res && JSON.parse(res.Data) || undefined;
    }

    public async getForecast(id: number): Promise<Weather[] | undefined> {
        const res = await this.dao.get(
            'SELECT Data FROM Forecast WHERE LocationID = :id AND Time > :time',
            {
                ':id': id,
                ':time': new Date().getTime() - 3000 * 60 * 60,
            }
        );
        return res && JSON.parse(res.Data) || undefined;
    }

    public async close(): Promise<void> {
        await this.dao.close();
    }
}

export { DataBase };
