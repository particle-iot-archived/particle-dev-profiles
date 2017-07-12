'use babel';

import { expect } from 'chai';
import Device from '../../src/objects/device';

describe('Device object', () => {
	it('loads data from V1 API object', () => {
		let device = Device.fromApiV1({
			"id": "3e0039661747666236343033",
			"name": "yellow-moon",
			"last_app": "1551d2f05ad2a09dda26bcff0ddb3c3d",
			"last_ip_address": "37.94.26.176",
			"last_heard": "2017-07-11T12:30:19.761Z",
			"product_id": 6,
			"connected": true,
			"platform_id": 6,
			"cellular": false,
			"status": "normal",
			"current_build_target": "0.6.2-rc.1",
			"pinned_build_target": "0.7.0-rc.1",
			"default_build_target": "0.6.2"
		});

		expect(device).to.eql({
			"id": "3e0039661747666236343033",
			"name": "yellow-moon",
			"lastApp": "1551d2f05ad2a09dda26bcff0ddb3c3d",
			"lastIpAddress": "37.94.26.176",
			"lastHeard": "2017-07-11T12:30:19.761Z",
			"productId": 6,
			"isConnected": true,
			"platformId": 6,
			"isCellular": false,
			"status": "normal",
			"currentBuildTarget": "0.6.2-rc.1",
			"defaultBuildTarget": "0.6.2"
		});
	});

	it('serializes and deserilizes object', () => {
		let device = new Device();
		device.foo = 'bar';
		device.baz = 1;
		device.bar = true;

		let serialized = device.serialize();
		device = Device.deserialize(serialized);

		expect(device).to.eql({
			foo: 'bar',
			baz: 1,
			bar: true
		});
	});
});
