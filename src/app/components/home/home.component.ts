import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    ipcRenderer.on("renderer-event-reply", function (event, args) {
      console.log("Args :: ", args);

      console.log('Event :: ', event);
    });

    ipcRenderer.send("renderer-event", { action: "", model: "" });
  }

}
