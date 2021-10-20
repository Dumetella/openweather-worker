import { join } from 'path';
import sqlite3 from 'sqlite3';

const DB_PATH_DEFAULT = 'Weather.db';

type SQL_params = {
    [key: string]: string | number
};

export default class appDAO {
    private db: sqlite3.Database;
    private fileName: string;
    constructor(file?: string) {
        this.fileName = join(process.cwd(), file || DB_PATH_DEFAULT);
        this.db = new sqlite3.Database(this.fileName, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.warn('Could not connect to database', err);
            } else {
                console.log('Connected to database');
            }
        });
    }

    public run(sql: string, params?: SQL_params): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.run(sql, params, (err) => {
                if (err) {
                    console.warn('Error running sql ' + sql);
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    public get(sql: string, params?: SQL_params): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.warn('Error running sql ' + sql);
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

    public close(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    console.log('Error while closing the database');
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
