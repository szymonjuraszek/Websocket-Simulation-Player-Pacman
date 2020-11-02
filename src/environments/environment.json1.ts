import {JsonFormatter} from '../app/formatter/JsonFormatter';

export const environment = {
  production: false,
  FORMATTER: new JsonFormatter(),
  startPlayer: 1,
  endPlayer: 5
};
