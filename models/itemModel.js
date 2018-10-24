"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var Q = require("q");
var categoryModel_1 = require("./categoryModel");
var _ = require("lodash");
var STORE_NAME = "item";
var ItemModel = /** @class */ (function (_super) {
    __extends(ItemModel, _super);
    function ItemModel() {
        var _this = _super.call(this) || this;
        _this.setDataStoreName(STORE_NAME);
        _this.loadDataStore();
        return _this;
    }
    ItemModel.prototype.findAllDocs = function () {
        var _self = this;
        return Q.Promise(function (resolve, reject) {
            _self.db.find({}, function (error, docs) {
                if (error) {
                    console.log("ItemModel Error :: ", error);
                    return reject("");
                }
                return resolve(docs);
            });
        });
    };
    ItemModel.prototype.createItem = function (itemData) {
        // add the stock parameters to the item
        itemData.stock = {
            openingStock: 0,
            currentStock: 0,
            closingStock: 0
        };
        // calculate the item code
        var _self = this;
        return Q.Promise(function (resolve, reject) {
            _self.generateItemCode(itemData)
                .then(function (itemCodeData) {
                itemData.itemSuffix = itemCodeData.itemSuffix;
                itemData.itemCode = itemCodeData.itemCode;
                _self.db.insert(itemData, function (error, newDoc) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(newDoc);
                });
            })
                .catch(function () {
            });
        });
    };
    ItemModel.prototype.updateItem = function (item) {
        var _self = this;
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
    };
    ItemModel.prototype.generateItemCode = function (item) {
        var itemSuffix = 10;
        var itemCode;
        var _self = this;
        return Q.Promise(function (resolve, reject) {
            // get the code for category name
            categoryModel_1.Category.findByName(item.category)
                .then(function (result) {
                var category = result;
                // get the last item with category name and suffix
                _self.getAllItemsForCategory(item.category)
                    .then(function (items) {
                    if (items.length) {
                        // calculate the next suffix
                        var sortedItems = _.orderBy(items, ['itemSuffix'], ['desc']);
                        itemSuffix = sortedItems[0].itemSuffix + 1;
                    }
                    itemCode = String(category.code) + String(itemSuffix);
                    return resolve({
                        itemCode: itemCode,
                        itemSuffix: itemSuffix
                    });
                });
            });
        });
    };
    ItemModel.prototype.getAllItemsForCategory = function (category) {
        var _self = this;
        return Q.Promise(function (resolve, reject) {
            _self.db.find({ category: category }, function (error, docs) {
                if (error) {
                    console.log("Error fetching items for category :: ", error);
                    return reject(error);
                }
                return resolve(docs);
            });
        });
    };
    return ItemModel;
}(index_1.default));
exports.ItemModel = ItemModel;
exports.Item = new ItemModel();
//# sourceMappingURL=itemModel.js.map