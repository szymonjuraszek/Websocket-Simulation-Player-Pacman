import {Component} from '@angular/core';

// @ts-ignore
import * as  data from '../../websocketData.json';
import {WebsocketSimulationConnection} from './WebsocketSimulationConnection';
import {MeasurementService} from './measurement/MeasurementService';
import {DownloadService} from './downloader/DownloadService';
import {environment} from '../environments/environment';
import {ProtobufFormatter} from './formatter/ProtobufFormatter';
import {JsonFormatter} from './formatter/JsonFormatter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private downloadService: DownloadService;
  private readonly measurementService: MeasurementService;
  private howManyObjects: number;

  // tslint:disable-next-line:typedef
  onKey(event) {
    this.howManyObjects = event.target.value;
  }

  constructor() {
    this.measurementService = new MeasurementService();
    this.downloadService = new DownloadService(this.measurementService);
  }

  setSendingSpeedAndStart(speed: number, type: string): void {
    const examplePlayers = (data as any).default;
    const simulationConnection = new Array(examplePlayers.length);
    let formatter;
    switch (type) {
      case 'proto': {
        formatter = new ProtobufFormatter();
        break;
      }
      case 'json': {
        formatter = new JsonFormatter();
        break;
      }
    }

    for (let i = environment.startPlayer; i < environment.endPlayer; i++) {
      simulationConnection[i] = new WebsocketSimulationConnection(examplePlayers[i].nickname,
        this.measurementService,
        speed, formatter, this.howManyObjects
      );
      simulationConnection[i].initializeConnection(examplePlayers[i], 1000 + 10000 * i);
    }
  }

  downloadFile(): void {
    this.downloadService.downloadResponseFile(this.measurementService.getResponseMeasurements());
  }
}
