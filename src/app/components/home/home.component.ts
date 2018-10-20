import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';

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
    this.electronService.ipcRenderer.on("reply-to-frontend", function (event, args) {
      console.log("Args :: ", args);

      _self.items = args;

      console.log('Event :: ', event);
    });

    this.electronService.ipcRenderer.send("notify-backend", { action: "", model: "" });
  }

}
