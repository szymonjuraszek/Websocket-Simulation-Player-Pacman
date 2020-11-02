import {Component} from '@angular/core';

// @ts-ignore
import * as  data from '../../websocketData.json';
import {WebsocketSimulationConnection} from './WebsocketSimulationConnection';
import {MeasurementService} from './measurement/MeasurementService';
import {DownloadService} from './downloader/DownloadService';
import {environment} from '../environments/environment';

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

    for (let i = environment.startPlayer; i < environment.endPlayer; i++) {
      simulationConnection[i] = new WebsocketSimulationConnection(examplePlayers[i].nickname, this.measurementService, speed);
      simulationConnection[i].initializeConnection(examplePlayers[i], 1000 + 10000 * i);
    }
  }

  downloadFile(): void {
    this.downloadService.downloadResponseFile(this.measurementService.getResponseMeasurements());
  }
}
