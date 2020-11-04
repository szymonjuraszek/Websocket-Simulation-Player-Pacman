import {Client} from '@stomp/stompjs';
import {interval, Subscription} from 'rxjs';
import {IFormatter} from './formatter/IFormatter';
import {ProtobufFormatter} from './formatter/ProtobufFormatter';
import {MeasurementService} from './measurement/MeasurementService';
import {JsonFormatter} from './formatter/JsonFormatter';
import {COMMUNICATION_TIME, SIZE_OF_ADDITIONAL_DATA, URL_WEBSOCKET} from '../../globalConfig';
import {environment} from '../environments/environment';
import {AdditionalData} from './model/AdditionalData';

export class WebsocketSimulationConnection {
  // SIZE
  private additionalData = this.randomString(25, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  private arrayWithAdditionalData: Array<AdditionalData> = new Array<AdditionalData>(SIZE_OF_ADDITIONAL_DATA);

  // FREQUENCY
  private readonly speed;

  // MEASUREMENT
  private timeForStartCommunication;
  private measurementService: MeasurementService;

  // COMMUNICATION
  private stompClient: Client;
  private formatter: IFormatter;
  private readonly nick;
  private sub: Subscription;

  constructor(nick, measurementService, speed, formatter) {
    this.nick = nick;
    this.measurementService = measurementService;
    this.setFormatter(formatter);
    this.speed = speed;
  }

  initializeConnection(data, timeToSend): void {
    this.stompClient = new Client({
      brokerURL: URL_WEBSOCKET,
      splitLargeFrames: true,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });
    this.stompClient.debug = () => {
    };

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe('/pacman/add/players', (gameToAddPlayer) => {
      });

      this.stompClient.subscribe('/pacman/remove/player', (playerToRemove) => {
      });

      this.stompClient.subscribe('/pacman/update/player', (playerToUpdate) => {
        if (this.nick === 'second06') {
          const parsedPlayer = this.formatter.decodePlayer(playerToUpdate);
          if (parsedPlayer.nickname.match('second*')) {
            const responseTimeInMillis = new Date().getTime() - Number(playerToUpdate.headers.requestTimestamp);
            this.measurementService.addMeasurementResponse(
              parsedPlayer.nickname,
              responseTimeInMillis,
              Math.ceil((Number(playerToUpdate.headers.requestTimestamp) - this.timeForStartCommunication) / 1000),
              parsedPlayer.version,
              Number(playerToUpdate.headers['content-length']),
              Number(playerToUpdate.headers.requestTimestamp));
          }
        }
      });

      this.stompClient.subscribe('/pacman/update/monster', (monster) => {
      });

      this.stompClient.subscribe('/user/queue/player', (playerToUpdate) => {
        if (this.nick === 'second06') {
          const parsedPlayer = this.formatter.decodePlayer(playerToUpdate);
          if (parsedPlayer.nickname.match('second*')) {
            const responseTimeInMillis = new Date().getTime() - Number(playerToUpdate.headers.requestTimestamp);
            this.measurementService.addMeasurementResponse(
              parsedPlayer.nickname,
              responseTimeInMillis,
              Math.ceil((Number(playerToUpdate.headers.requestTimestamp) - this.timeForStartCommunication) / 1000),
              parsedPlayer.version,
              Number(playerToUpdate.headers['content-length']),
              Number(playerToUpdate.headers.requestTimestamp));
          }
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.log('Broker reported error: ' + frame.headers.message);
      console.log('Additional details: ' + frame.body);
    };

    console.error('Inicjalizuje polaczenie.');
    this.stompClient.activate();

    this.timeForStartCommunication = new Date().getTime();
    setTimeout(() => {
      this.joinToGame(this.nick);
      this.addPlayer(this.nick);
      console.error('Polaczylem sie');
    }, timeToSend - 500);

    let timesRun = 0;
    let strategy = true;

    for (let i = 0; i < this.arrayWithAdditionalData.length; i++) {
      this.arrayWithAdditionalData[i] = new AdditionalData(11111, 22222, 33333, this.additionalData);
    }
    data.additionalData = this.arrayWithAdditionalData;

    setTimeout(() => {
      const sender = interval(this.speed);
      this.sub = sender.subscribe(() => {
        timesRun += 1;
        if (timesRun === 200) {
          timesRun = 0;
          strategy = !strategy;
        }
        if (strategy) {
          data.positionX -= 4;
        } else {
          data.positionX += 4;
        }
        data.version++;

        this.sendPosition(data);
      });
    }, timeToSend);

    setTimeout(() => {
      this.sub.unsubscribe();
      console.error('Zakonczono komunikacje z serverem');
      this.disconnect();
    }, COMMUNICATION_TIME);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  sendPosition(dataToSend): void {
    const dataWithSpecificFormat = this.formatter.encode(dataToSend);
    if (this.formatter instanceof JsonFormatter) {
      this.stompClient.publish({
        destination: '/app/send/position',
        body: JSON.stringify(
          dataToSend
        ),
        headers: {
          requestTimestamp: new Date().getTime().toString()
        }
      });
    } else if (this.formatter instanceof ProtobufFormatter) {
      this.stompClient.publish({
        destination: '/app/send/position/protobuf',
        binaryBody: dataWithSpecificFormat.serializeBinary(),
        headers: {
          /*'content-type': 'application/octet-stream',*/
          requestTimestamp: new Date().getTime().toString()
        }
      });
    }
  }

  joinToGame(nickname: string): void {
    this.stompClient.publish({
      destination: '/app/join/game',
      body: JSON.stringify({
        nickname
      })
    });
  }

  addPlayer(nickname: string): void {
    this.stompClient.publish({
      destination: '/app/add/player',
      body: JSON.stringify({
        nickname
      })
    });
  }

  disconnect(): void {
    console.error('Disconnected');
    this.stompClient.deactivate();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  setFormatter(formatter): any {
    this.formatter = formatter;
  }

  randomString(length, chars): any {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  makeId(length): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
