import {MeasurementResponse} from './MeasurementResponse';

export class MeasurementService {
  private readonly measurements = new Array<MeasurementResponse>();

  addMeasurementResponse(
    id: string,
    responseTimeInMillis: number,
    specificSecondOfCommunication: number,
    version: number, size: number,
    requestTimestamp: number
  ): void {
    this.measurements.push(new MeasurementResponse(
      id,
      responseTimeInMillis,
      specificSecondOfCommunication,
      version,
      size,
      requestTimestamp
    ));
  }

  getResponseMeasurements(): Array<MeasurementResponse> {
    return this.measurements;
  }
}
