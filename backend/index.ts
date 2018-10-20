import { ipcMain } from 'electron';
import { Item } from '../models/itemModel';
import { importExpr } from '@angular/compiler/src/output/output_ast';

export default class SIDBackend {
    constructor() {
        this.startListening();
    }

    startListening() {
        ipcMain.on('backend-event', (event, args) => {
            // check for the action model and action

            console.log("Args :: ", args);

            Item
                .findAllDocs()
                .then(function (docs) {
                    event.sender.send('renderer-event-reply', docs);
                });
        });
    }
}