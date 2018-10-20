import { app } from 'electron';
import * as Datastore from 'nedb';
import * as path from 'path';
import { TouchSequence } from 'selenium-webdriver';

export default class SIDModel {
    dataStoreName: string;
    appPath: string;
    db: Datastore;

    constructor() {
        // get app path
        this.appPath = app.getAppPath();
    }

    loadDataStore() {
        // create and load datastore
        const datastorePath = path.join(this.appPath, this.dataStoreName);
        console.log("Stock DB :: ", datastorePath);
        this.db = new Datastore({ filename: datastorePath, autoload: true });
    }
}