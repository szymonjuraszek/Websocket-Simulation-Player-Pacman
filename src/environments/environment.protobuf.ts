import {ProtobufFormatter} from '../app/formatter/ProtobufFormatter';

export const environment = {
  production: false,
  FORMATTER: new ProtobufFormatter(),
  startPlayer: 0,
  endPlayer: 5
};
