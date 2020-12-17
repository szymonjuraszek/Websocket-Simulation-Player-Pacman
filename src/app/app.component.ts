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

  constructor() {
    this.measurementService = new MeasurementService();
    this.downloadService = new DownloadService(this.measurementService);
  }

  setSendingSpeedAndStart(speed: number): void {
    const examplePlayers = (data as any).default;
    const simulationConnection = new Array(examplePlayers.length);

    simulationConnection[environment.whichPlayer] = new WebsocketSimulationConnection(
      examplePlayers[environment.whichPlayer].nickname,
      this.measurementService, speed
    );
    simulationConnection[environment.whichPlayer].initializeConnection(
      examplePlayers[environment.whichPlayer],
      1000 - (300 * environment.whichPlayer) + 10000 * environment.whichPlayer
    );
  }

  downloadFile(): void {
    this.downloadService.downloadResponseFile(this.measurementService.getResponseMeasurements());
  }
}
