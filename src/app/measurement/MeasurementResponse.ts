export class MeasurementResponse {
  // tslint:disable-next-line:variable-name
  private _id: string;
  // tslint:disable-next-line:variable-name
  private _response_time_in_millis: number;
  // tslint:disable-next-line:variable-name
  private _specific_second_of_communication: number;
  // tslint:disable-next-line:variable-name
  private _version_response: number;
  // tslint:disable-next-line:variable-name
  private _size: number;
  // tslint:disable-next-line:variable-name
  private _request_timestamp: number;


  // tslint:disable-next-line:variable-name
  constructor(
    id: string,
    // tslint:disable-next-line:variable-name
    response_time_in_millis: number,
    // tslint:disable-next-line:variable-name
    specific_second_of_communication: number,
    // tslint:disable-next-line:variable-name
    version_response: number,
    size: number,
    // tslint:disable-next-line:variable-name
    request_timestamp: number
  ) {
    this._id = id;
    this._response_time_in_millis = response_time_in_millis;
    this._specific_second_of_communication = specific_second_of_communication;
    this._version_response = version_response;
    this._size = size;
    this._request_timestamp = request_timestamp;
  }

  get response_time_in_millis(): number {
    return this._response_time_in_millis;
  }

  set response_time_in_millis(value: number) {
    this._response_time_in_millis = value;
  }

  get specific_second_of_communication(): number {
    return this._specific_second_of_communication;
  }

  set specific_second_of_communication(value: number) {
    this._specific_second_of_communication = value;
  }

  get version_response(): number {
    return this._version_response;
  }

  set version_response(value: number) {
    this._version_response = value;
  }


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
  }


  get request_timestamp(): number {
    return this._request_timestamp;
  }

  set request_timestamp(value: number) {
    this._request_timestamp = value;
  }
}
