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
var STORE_NAME = "usersdb";
var ItemModel = /** @class */ (function (_super) {
    __extends(ItemModel, _super);
    function ItemModel() {
        var _this = _super.call(this) || this;
        _this.dataStoreName = STORE_NAME;
        _this.loadDataStore();
        return _this;
    }
    ItemModel.prototype.findAllDocs = function () {
        var _self = this;
        return Q.Promise(function (resolve, reject) {
            _self.db.find({}, function (error, docs) {
                console.log("Docs LL ", docs);
                if (error) {
                    console.log("ItemModel Error :: ", error);
                    return reject("");
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