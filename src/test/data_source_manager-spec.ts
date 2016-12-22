import {DataSource} from "../app/DataSource";
import {DataSourceManager} from "../app/DataSourceManager";
import * as sinon from "sinon";
import {expect} from "chai";
import {DataSourceCallback} from "../app/DataSourceCallback";

class DummySource implements DataSource {
    getData(key: string, callback: Function): any {
        return "dummy_data";
    }

    putData(key: string, value: any): void {
    }
}

class DummyListener implements DataSourceCallback {
    onData(data: any): void {
    }
}


describe("DataSourceManager", function () {
    it("Should get data from a Data Source", (done) => {
        const key = "some_key";
        const dummy_data = "dummy_data";
        const dummySource = new DummySource();
        const dummyListener = new DummyListener();

        sinon.stub(dummySource, "getData", function (key: string, callback: Function) {
            return callback(dummy_data);
        });

        sinon.stub(dummyListener, "onData", function (data: any) {
            expect(data).to.equal(dummy_data);
            done();
        });

        let manager: DataSourceManager = new DataSourceManager(dummySource);
        manager.getData(key, dummyListener);
    });

    it("Should call 2 Sources and stop", function (done) {
        const key = "some_key";
        const dummy_data = "dummy_data";
        const emptySource = new DummySource();
        const dummySource = new DummySource();
        const throwSource = new DummySource();
        const dummyListener = new DummyListener();

        sinon.stub(emptySource, "getData", function (key: string, callback: Function) {
            return callback(null);
        });

        sinon.stub(dummySource, "getData", function (key: string, callback: Function) {
            return callback(dummy_data);
        });

        sinon.stub(throwSource, "getData", function (key: string, callback: Function) {
            throw new Error("Shouldn't be calling this");
        });

        sinon.stub(dummyListener, "onData", function (data: any) {
            expect(data).to.equal(dummy_data);
            done();
        });

        let manager: DataSourceManager = new DataSourceManager(emptySource, dummySource, throwSource);
        manager.getData(key, dummyListener);
    });
});
