import {DataSource} from "./DataSource";
import {DataSourceCallback} from "./DataSourceCallback";

export class DataSourceManager {
    private dataSources: Array<DataSource>;

    constructor(dataSource: DataSource, ...dataSources: DataSource[]) {
        this.dataSources = [];
        this.dataSources.push(dataSource);

        if (!!dataSources) {
            dataSources.forEach((value: DataSource, index: number, array: DataSource[]) => {
                this.dataSources.push(value);
            });
        }
    }

    public getData(key: string, callback: DataSourceCallback): any {
        this.internal_get_data(0, key, callback, []);
    }

    private internal_get_data(index: number, key: string, callback: DataSourceCallback, accumulated: Array<DataSource>): void {
        let dataSource = this.dataSources[index];

        dataSource.getData(key, (data: any) => {
            if (!!data) {
                accumulated.forEach((source: DataSource, index: number, array: DataSource[]) => {
                    source.putData(key, data);
                });
                callback.onData(data);
            } else {
                accumulated.push(dataSource);
                index++;
                this.internal_get_data(index, key, callback, accumulated);
            }
        });
    }
}
