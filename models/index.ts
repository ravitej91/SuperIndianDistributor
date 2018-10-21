import { app } from 'electron';
import * as Datastore from 'nedb';
import * as path from 'path';

const databaseFolder = "database";

export default class SIDModel {
    dataStoreName: string;
    appPath: string;
    db: Datastore;

    constructor() {
        // get app path
        this.appPath = app.getPath('userData');
    }

    setDataStoreName(dataStoreName) {
        this.dataStoreName = path.join(databaseFolder, dataStoreName + '.json');
    }

    loadDataStore() {
        // create and load datastore
        const datastorePath = path.join(this.appPath, this.dataStoreName);
        console.log("Database path :: ", datastorePath);
        this.db = new Datastore({
            timestampData: true,
            filename: datastorePath,
            autoload: true
        });
    }

    invokeAction(action, data) {
        return this[action](data);
    }
}