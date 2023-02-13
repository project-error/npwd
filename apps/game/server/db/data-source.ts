import { DataSource } from 'typeorm';
import { CONNECTION_STRING } from './db_utils';

export class NPWDDataSource {
  dataSource: DataSource;

  constructor() {
    const mysqlConnectionString = GetConvar(CONNECTION_STRING, 'none');
    this.dataSource = new DataSource({
      type: 'mysql',
      url: mysqlConnectionString,
    });
  }
}
