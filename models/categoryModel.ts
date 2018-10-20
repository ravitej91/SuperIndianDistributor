import SIDModel from './index';
import * as Q from 'q';
import * as _ from 'lodash';

const STORE_NAME = "category";
const CATEGORY_NAMES = ['oil', 'peanuts', 'maida'];

export class CategoryModel extends SIDModel {
    constructor() {
        super();
        this.setDataStoreName(STORE_NAME);
        this.loadDataStore();
        this.syncCategories();
    }


    // create the categories if does not exist
    syncCategories() {
        // flush all the categories and create once again
        this.removeAllCategories()
            .then(() => {
                return this.createAllCategories()
            })
            .then(() => {
                console.log("Category Sync Completed");
            });
    }

    createAllCategories() {
        return Q.Promise((resolve, reject) => {
            let categoryDocs = [];

            CATEGORY_NAMES.map((category) => {
                categoryDocs.push({ name: category });
            });

            this.db.insert(categoryDocs, (error, docs) => {
                if (error) {
                    return reject(error);
                }

                return resolve(docs);
            })
        });
    }

    removeAllCategories() {
        return Q.Promise((resolve, reject) => {
            // Removing all documents with the 'match-all' query
            this.db.remove({}, { multi: true }, function (err, numRemoved) {
                if (err) {
                    console.log("Error removing documents :: ", err);

                    return reject(err);
                }

                return resolve(numRemoved);
            });
        });
    }

    findAllDocs() {
        let _self = this;
        return Q.Promise(function (resolve, reject) {
            _self.db.find({}, function (error, docs) {
                if (error) {
                    console.log("Category Error :: ", error);

                    return reject(error);
                }

                return resolve(docs);
            });
        });
    }
}

export let Category: CategoryModel = new CategoryModel();