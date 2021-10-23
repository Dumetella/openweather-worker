import log4js from 'log4js';
import { join } from 'path';
import sqlite3 from 'sqlite3';

const DB_PATH_DEFAULT = 'Weather.db';

type SQL_params = {
    [key: string]: string | number
};

export default class appDAO {
    private db: sqlite3.Database;
    private fileName: string;
    private logger: log4js.Logger;
    constructor(file?: string) {
        this.logger = log4js.getLogger('AppDAO');
        this.fileName = join(process.cwd(), file || DB_PATH_DEFAULT);
        this.db = new sqlite3.Database(this.fileName, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                this.logger.error('Could not connect to database', err);
            } else {
                this.logger.info('Connected to database');
            }
        });
    }

    public run(sql: string, params?: SQL_params): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.run(sql, params, (err) => {
                if (err) {
                    this.logger.error('Error running sql ' + sql);
                    this.logger.error(err);
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
                    this.logger.error('Error running sql ' + sql);
                    this.logger.error(err);
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
                    this.logger.error('Error while closing the database');
                    this.logger.error(err);
                    reject(err);
                    return;
                }
                resolve();
                this.logger.info('Database connection closed');
            });
        });
    }
}
