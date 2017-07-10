'use babel';
/* global atom */

/**
 * @class Unified device class. Abstracts any format coming from the API
 */
export default class Device {
	/**
	 * Load attributes from API v1 object
	 *
	 * @static
	 * @param  {Object} obj Device payload
	 * @return {Object}     `Device` instance
	 */
	static fromApiV1(object) {
		const mapping = {
			id: null,
			cellular: 'isCellular',
			connected: 'isConnected',
			current_build_target: 'currentBuildTarget',
			default_build_target: 'defaultBuildTarget',
			last_app: 'lastApp',
			last_heard: 'lastHeard',
			last_ip_address: 'lastIpAddress',
			name: null,
			platform_id: 'platformId',
			product_id: 'productId',
			status: null
		}

		let device = new Device();
		return device._mapAttributes(object, mapping);
	}

	/**
	 * Deserialize object from `String`
	 *
	 * @static
	 * @param  {String} serialized Serialized object
	 * @return {Device}            Deserialized object
	 */
	static deserialize(serialized) {
		let deserialized = JSON.parse(serialized);
		let device = new Device();
		let mapping = {};
		Object.keys(deserialized).map((key) => mapping[key] = null);

		return device._mapAttributes(deserialized, mapping);
	}

	/**
	 * Serialize Device object
	 *
	 * @return {String} Serialized object
	 */
	serialize() {
		return JSON.stringify(this);
	}

	/**
	 * Map object attributes to `this`. Mapping is an object where key is the
	 * name of key from object and value `this` key to be set. If value is
	 * `null` key name will be used.
	 *
	 * @param  {Object} object  Source object
	 * @param  {Object} mapping Attribute mapping
	 * @return {Object}         `this` object
	 */
	_mapAttributes(object, mapping) {
		Object.keys(mapping).map((key) => {
			let thisKey = mapping[key] ? mapping[key] : key;
			this[thisKey] = object[key];
		});

		return this;
	}
}
