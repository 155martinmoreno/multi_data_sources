import {DataSourceCallback} from "./DataSourceCallback";

export declare interface DataSource {

  getData(key: string, callback: DataSourceCallback): any;

  putData(key: string, value: any): void;

}
