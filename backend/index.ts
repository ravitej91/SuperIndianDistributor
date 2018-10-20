import { ipcMain } from 'electron';
import { Item } from '../models/itemModel';
import { Category } from '../models/categoryModel';
import * as Q from 'q';

const definedModels = {
    Category: Category,
    Item: Item
}

export default class SIDBackend {
    constructor() {
        this.startListening();
    }

    startListening() {
        ipcMain.on('notify-backend', (event, args) => {
            // check for the action model and action
            this.invokeAction(args.model, args.action)
                .then(function (docs) {
                    event.sender.send(args.listener, {
                        result: docs
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }

    invokeAction(model, action) {
        return Q.Promise(function (resolve, reject) {
            definedModels[model]
                .invokeAction(action)
                .then(function (result) {
                    return resolve(result);
                }).catch(function (err) {
                    return reject(err);
                });
        });
    }
}