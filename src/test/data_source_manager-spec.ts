import {DataSource} from "../app/DataSource";
import {DataSourceManager} from "../app/DataSourceManager";
import * as sinon from "sinon";
import {expect} from "chai";
import {DataSourceCallback} from "../app/DataSourceCallback";
import * as Collections from "typescript-collections";

class DummySource implements DataSource {
    private values: Collections.Dictionary<String, any> = new Collections.Dictionary<String, any>();

    getData(key: string, callback: Function): any {
        callback(this.values.getValue(key));
    }

    putData(key: string, value: any): void {
        this.values.setValue(key, value);
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

    it("Should get data from a source and save it in another", function (done) {
        const key = "some_key";
        const dummy_data = "dummy_data";
        const dummySource = new DummySource();
        const destinationSource0 = new DummySource();
        const destinationSource1 = new DummySource();
        const destinationSource2 = new DummySource();
        const destinationSource3 = new DummySource();
        const dummyListener = new DummyListener();

        sinon.stub(dummySource, "getData", function (key: string, callback: Function) {
            return callback(dummy_data);
        });

        sinon.stub(dummyListener, "onData", function (data: any) {
            let callback = (data: any) => {
                expect(data).to.equal(dummy_data);

                if (spy.callCount === 4) {
                    done();
                }
            };

            let spy = sinon.spy(callback);
            destinationSource0.getData(key, spy);
            destinationSource1.getData(key, spy);
            destinationSource2.getData(key, spy);
            destinationSource3.getData(key, spy);
        });

        let manager: DataSourceManager = new DataSourceManager(destinationSource0, destinationSource1, destinationSource2, destinationSource3, dummySource);
        manager.getData(key, dummyListener);
    });
});
