"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var Datastore = require("nedb");
var path = require("path");
var databaseFolder = "database";
var SIDModel = /** @class */ (function () {
    function SIDModel() {
        // get app path
        this.appPath = electron_1.app.getPath('userData');
    }
    SIDModel.prototype.setDataStoreName = function (dataStoreName) {
        this.dataStoreName = path.join(databaseFolder, dataStoreName + '.json');
    };
    SIDModel.prototype.loadDataStore = function () {
        // create and load datastore
        var datastorePath = path.join(this.appPath, this.dataStoreName);
        console.log("Stock DB :: ", datastorePath);
        this.db = new Datastore({ filename: datastorePath, autoload: true });
    };
    return SIDModel;
}());
exports.default = SIDModel;
//# sourceMappingURL=index.js.map