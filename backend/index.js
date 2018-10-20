"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var itemModel_1 = require("../models/itemModel");
var SIDBackend = /** @class */ (function () {
    function SIDBackend() {
        this.startListening();
    }
    SIDBackend.prototype.startListening = function () {
        electron_1.ipcMain.on('backend-event', function (event, args) {
            // check for the action model and action
            console.log("Args :: ", args);
            itemModel_1.Item
                .findAllDocs()
                .then(function (docs) {
                event.sender.send('renderer-event-reply', docs);
            });
        });
    };
    return SIDBackend;
}());
exports.default = SIDBackend;
//# sourceMappingURL=index.js.map