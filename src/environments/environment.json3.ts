import {JsonFormatter} from '../app/formatter/JsonFormatter';

export const environment = {
  production: false,
  FORMATTER: new JsonFormatter(),
  startPlayer: 10,
  endPlayer: 14
};
