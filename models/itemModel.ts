import SIDModel from './index';
import * as Q from 'q';
import { Category } from './categoryModel';
import * as _ from 'lodash';


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

    createItem(itemData) {
        // add the stock parameters to the item
        itemData.stock = {
            openingStock: 0,
            currentStock: 0,
            closingStock: 0
        };
        // calculate the item code

        let _self = this;
        return Q.Promise((resolve, reject) => {
            _self.generateItemCode(itemData)
                .then(function (itemCodeData) {
                    itemData.itemSuffix = (itemCodeData as any).itemSuffix;
                    itemData.itemCode = (itemCodeData as any).itemCode;
                    _self.db.insert(itemData, function (error, newDoc) {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(newDoc);
                    });
                })
                .catch(function () {

                })
        });
    }

    updateItem(item) {
        let _self = this;
        return Q.Promise(function (resolve, reject) {
            // update the database
            _self.db.update({ _id: item._id }, item, {}, function (err, replacedDocument) {
                if (err) {
                    console.log("Error :: Items updated error :: ", err);

                    return reject(err);
                }

                return resolve(replacedDocument);
            });
        });


    }

    generateItemCode(item) {
        let itemSuffix = 10;
        let itemCode;
        var _self = this;
        return Q.Promise((resolve, reject) => {

            // get the code for category name
            Category.findByName(item.category)
                .then(function (result) {
                    let category = (result as any);
                    // get the last item with category name and suffix
                    _self.getAllItemsForCategory(item.category)
                        .then((items) => {
                            if ((items as any).length) {
                                // calculate the next suffix
                                let sortedItems = _.orderBy(items, ['itemSuffix'], ['desc']);
                                itemSuffix = (sortedItems as any)[0].itemSuffix + 1;
                            }

                            itemCode = String(category.code) + String(itemSuffix);

                            return resolve({
                                itemCode: itemCode,
                                itemSuffix: itemSuffix
                            })
                        })
                })
        });
    }

    getAllItemsForCategory(category) {
        let _self = this;
        return Q.Promise(function (resolve, reject) {
            _self.db.find({ category: category }, function (error, docs) {
                if (error) {
                    console.log("Error fetching items for category :: ", error);

                    return reject(error);
                }

                return resolve(docs);
            });
        });
    }
}

export let Item: ItemModel = new ItemModel();