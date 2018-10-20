import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  items: Array<any>;
  constructor() {

  }

  ngOnInit() {
    let _self = this;
    ipcRenderer.on("reply-to-frontend", function (event, args) {
      console.log("Args :: ", args);

      _self.items = args;

      console.log('Event :: ', event);
    });

    ipcRenderer.send("notify-backend", { action: "", model: "" });
  }

}
