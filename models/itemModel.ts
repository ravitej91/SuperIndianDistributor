import SIDModel from './index';
import * as Q from 'q';

const STORE_NAME = "item";

export class ItemModel extends SIDModel {
    constructor() {
        super();
        this.setDataStoreName(STORE_NAME);
        this.loadDataStore();
    }

    findAllDocs() {
        let _self = this;
        return Q.Promise(function (resolve, reject) {
            _self.db.find({}, function (error, docs) {
                if (error) {
                    console.log("ItemModel Error :: ", error);

                    return reject("");
                }

                return resolve(docs);
            });
        });
    }
}

export let Item: ItemModel = new ItemModel();