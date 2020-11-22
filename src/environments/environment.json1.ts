import {JsonFormatter} from '../app/formatter/JsonFormatter';
import {ProtobufFormatter} from '../app/formatter/ProtobufFormatter';

export const environment = {
  production: false,
  FORMATTER: new ProtobufFormatter(),
  startPlayer: 1,
  endPlayer: 5
};
