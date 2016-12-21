export declare interface DataSource {

  getData(key: string, callback: Function): any;

  putData(key: string, value: any): void;

}
