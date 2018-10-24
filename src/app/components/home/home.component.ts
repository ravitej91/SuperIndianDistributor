import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  items: Array<any>;
  electronService: ElectronService
  constructor(electronService: ElectronService) {
    this.electronService = electronService
  }

  ngOnInit() {
    let _self = this;

    this.refreshItemList();

    this.electronService.ipcRenderer.on("item-list-listener", function (event, args) {
      _self.items = _.orderBy(args.result, ['itemCode'], ['asc']);
    });

    this.electronService.ipcRenderer.on("item-create-listener", function (event, args) {
      _self.refreshItemList();
    });

    this.electronService.ipcRenderer.on("item-update-listener", function (event, args) {
      _self.refreshItemList();
    });
  }


  refreshItemList() {
    // get all items
    this.electronService.ipcRenderer.send("notify-backend", {
      action: "findAllDocs",
      model: "Item",
      listener: "item-list-listener"
    });
  }

}
