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
var STORE_NAME = "category";
var CATEGORY_NAMES = [
    {
        name: 'Oil',
        code: 1
    },
    {
        name: 'Peanuts',
        code: 2
    }, {
        name: 'Maida',
        code: 3
    }
];
var CategoryModel = /** @class */ (function (_super) {
    __extends(CategoryModel, _super);
    function CategoryModel() {
        var _this = _super.call(this) || this;
        _this.setDataStoreName(STORE_NAME);
        _this.loadDataStore();
        _this.syncCategories();
        return _this;
    }
    // create the categories if does not exist
    CategoryModel.prototype.syncCategories = function () {
        var _this = this;
        // flush all the categories and create once again
        this.removeAllCategories()
            .then(function () {
            return _this.createAllCategories();
        })
            .then(function () {
            console.log("Category Sync Completed");
        });
    };
    CategoryModel.prototype.createAllCategories = function () {
        var _this = this;
        return Q.Promise(function (resolve, reject) {
            var categoryDocs = [];
            CATEGORY_NAMES.map(function (category) {
                categoryDocs.push(category);
            });
            _this.db.insert(categoryDocs, function (error, docs) {
                if (error) {
                    return reject(error);
                }
                return resolve(docs);
            });
        });
    };
    CategoryModel.prototype.removeAllCategories = function () {
        var _this = this;
        return Q.Promise(function (resolve, reject) {
            // Removing all documents with the 'match-all' query
            _this.db.remove({}, { multi: true }, function (err, numRemoved) {
                if (err) {
                    console.log("Error removing documents :: ", err);
                    return reject(err);
                }
                return resolve(numRemoved);
            });
        });
    };
    CategoryModel.prototype.findAllDocs = function () {
        var _self = this;
        return Q.Promise(function (resolve, reject) {
            _self.db.find({}, function (error, docs) {
                if (error) {
                    console.log("Category Error :: ", error);
                    return reject(error);
                }
                return resolve(docs);
            });
        });
    };
    CategoryModel.prototype.findByName = function (name) {
        var _self = this;
        return Q.Promise(function (resolve, reject) {
            _self.db.find({ name: name }, function (error, docs) {
                if (error) {
                    console.log("error :: ", error);
                    return reject(error);
                }
                console.log("Category:FindBYName :: Doc :: ", docs);
                return resolve(docs[0]);
            });
        });
    };
    return CategoryModel;
}(index_1.default));
exports.CategoryModel = CategoryModel;
exports.Category = new CategoryModel();
//# sourceMappingURL=categoryModel.js.map