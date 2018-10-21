"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var itemModel_1 = require("../models/itemModel");
var categoryModel_1 = require("../models/categoryModel");
var Q = require("q");
var definedModels = {
    Category: categoryModel_1.Category,
    Item: itemModel_1.Item
};
var SIDBackend = /** @class */ (function () {
    function SIDBackend() {
        this.startListening();
    }
    SIDBackend.prototype.startListening = function () {
        var _this = this;
        electron_1.ipcMain.on('notify-backend', function (event, args) {
            // check for the action model and action
            _this.invokeAction(args.model, args.action, args.data)
                .then(function (docs) {
                event.sender.send(args.listener, {
                    result: docs
                });
            })
                .catch(function (error) {
                console.log(error);
            });
        });
    };
    SIDBackend.prototype.invokeAction = function (model, action, data) {
        return Q.Promise(function (resolve, reject) {
            definedModels[model]
                .invokeAction(action, data)
                .then(function (result) {
                return resolve(result);
            }).catch(function (err) {
                return reject(err);
            });
        });
    };
    return SIDBackend;
}());
exports.default = SIDBackend;
//# sourceMappingURL=index.js.map