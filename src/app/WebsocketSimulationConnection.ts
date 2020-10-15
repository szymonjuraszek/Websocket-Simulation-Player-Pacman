import {Client} from '@stomp/stompjs';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
import {IFormatter} from './formatter/IFormatter';
import {ProtobufFormatter} from './formatter/ProtobufFormatter';
import {MeasurementService} from './measurement/MeasurementService';
import {JsonFormatter} from './formatter/JsonFormatter';

export class WebsocketSimulationConnection {
  private additionalData = this.randomString(1000, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  private variable = this.makeId(30000);
  private stompClient: Client;
  private formatter: IFormatter;
  private readonly nick;
  private sub: Subscription;

  private measurementService: MeasurementService;
  private timeForStartCommunication;

  constructor(nick, measurementService) {
    this.nick = nick;
    this.measurementService = measurementService;
    // this.setFormatter(new ProtobufFormatter());
    this.setFormatter(new JsonFormatter());
  }

  // tslint:disable-next-line:typedef
  randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  initializeConnection(data, timeToSend): void {
    this.stompClient = new Client({
      // brokerURL: 'ws://83.229.84.77:8080/socket',
      brokerURL: 'ws://localhost:8080/socket',
      // debug: (str) => {
      //   console.log(str);
      // },
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
        const parsedPlayer = this.formatter.decodePlayer(playerToUpdate);
        if (parsedPlayer.nickname === 'remote01' && parsedPlayer.nickname.match('remote*')) {
          const responseTimeInMillis = new Date().getTime() - Number(playerToUpdate.headers.requestTimestamp);
          this.measurementService.addMeasurementResponse(parsedPlayer.nickname, responseTimeInMillis,
            Math.ceil((Number(playerToUpdate.headers.requestTimestamp) - this.timeForStartCommunication) / 1000),
            parsedPlayer.version, playerToUpdate.headers.contentLength);
        }
      });

      this.stompClient.subscribe('/pacman/update/monster', (monster) => {
      });

      this.stompClient.subscribe('/pacman/refresh/coins', () => {
      });

      this.stompClient.subscribe('/pacman/get/coin', (coinPosition) => {
      });

      this.stompClient.subscribe('/user/queue/reply', (currentCoinPosition) => {
      });

      this.stompClient.subscribe('/user/queue/player', (playerToUpdate) => {
      });

      this.stompClient.subscribe('/pacman/collision/update', (allCoinPosition) => {
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.log('Broker reported error: ' + frame.headers.message);
      console.log('Additional details: ' + frame.body);
    };

    console.error('Inicjalizuje polaczenie.');
    this.stompClient.activate();

    setTimeout(() => {
      this.joinToGame(this.nick);
      this.addPlayer(this.nick);
      console.error('Polaczylem sie');
    }, 500);

    let timesRun = 0;
    let strategy = true;
    // data.additionalData = this.additionalData;
    setTimeout(() => {
      console.error('Zaczynam wysylac dane.');
      this.timeForStartCommunication = new Date().getTime();
      const sender = interval(20);
      this.sub = sender.subscribe(() => {
        timesRun += 1;
        if (timesRun === 300) {
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
    }, 100000);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  disconnect(): void {
    console.error('Disconnected');
    this.stompClient.deactivate();
  }

  sendPosition(dataToSend): void {
    const dataWithSpecificFormat = this.formatter.encode(dataToSend);
    if (this.formatter instanceof JsonFormatter) {
      this.stompClient.publish({
        destination: '/app/send/position',
        body: JSON.stringify(
          dataWithSpecificFormat
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

  makeId(length): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  setFormatter(formatter): any {
    this.formatter = formatter;
  }
}
