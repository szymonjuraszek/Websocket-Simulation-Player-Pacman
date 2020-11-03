import {saveAs} from 'file-saver';
import {HEADERS_IN_CSV_FILE} from '../../../globalConfig';
import {MeasurementService} from '../measurement/MeasurementService';

export class DownloadService {

  constructor(private cacheMeasurement: MeasurementService) {
  }

  private RESPONSE_FILE = 'response_measurement.csv';

  public downloadResponseFile(data: any): void {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    let header = HEADERS_IN_CSV_FILE;
    const csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    header = header.map((x) => {
      return x.toUpperCase();
    });
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    saveAs(new Blob([csvArray], {type: 'text/csv'}), this.RESPONSE_FILE);
  }

}
