'use babel';

import Api from 'particle-api-js';
import {File} from 'atom';
let Emitter;
let path;
let fs;

export default class ProfileManager {
	constructor() {
		({Emitter} = require('event-kit'));
		path = require('path');
		fs = require('fs-plus');
		this.emitter = new Emitter();
		this._reloadSettings();
		this._watchConfig();
		this._watchProfile();
	}

	destroy() {
		this.emitter.dispose();
		this.configWatcher.dispose();
		this.profileWatcher.dispose();
	}

	/**
	 * Get list of profiles defined in `~/.particle` directory
	 *
	 * @readonly
	 * @return {Array} list of profile names
	 */
	get profiles() {
		return this.settings.listConfigs();
	}

	/**
	 * Get current profile name
	 *
	 * @getter
	 * @return {String} profile name
	 */
	get currentProfile() {
		return this._reloadSettings(function afterReload(settings) {
			return settings.profile;
		});
	}

	/**
	 * Set current profile
	 *
	 * @setter
	 * @fires current-profile-changed
	 * @param  {String} profile Name of the profile to set
	 */
	set currentProfile(profile) {
		this._apiClient = undefined;

		this.settings.switchProfile(profile);
		this.emitter.emit('current-profile-changed', profile);
	}

	/**
	 * Return `key` value stored in current profile
	 *
	 * @param  {String} key Key name
	 * @return {Object}     Key value
	 */
	get(key) {
		return this._reloadSettings(() => this.settings.get(key));
	}

	/**
	 * Sets `key` to `value` in current profile
	 *
	 * @fires $KEY-changed
	 * @param  {String} key   Key to set
	 * @param  {Object} value Value to set
	 * @return {undefined}
	 */
	set(key, value) {
		return this._reloadSettings(() => {
			this.settings.override(null, key, value);
			this.emitter.emit(key + '-changed', value);
		});
	}

	/**
	 * Get local (current window's) key's value
	 *
	 * @param  {String} key Key name
	 * @return {Object}     Key value
	 */
	getLocal(key) {
		if (window.localSettings) {
			return window.localSettings[key];
		}
		return null;
	}

	/**
	 * Set local (current window's) key to value
	 *
	 * @fires $KEY-changed
	 * @param  {String} key   Key to set
	 * @param  {Object} value Value to set
	 * @return {undefined}
	 */
	setLocal(key, value) {
		if (!window.localSettings) {
			window.localSettings = {};
		}

		window.localSettings[key] = value;
		this.emitter.emit(key + '-changed', value);
	}

	/**
	 * Set current device's ID and name
	 *
	 * @param {String} id   Device ID
	 * @param {String} name Device name
	 * @return {undefined}
	 *
	 */
	setCurrentDevice(id, name) {
		this.setLocal('current-device', id);
		this.setLocal('current-device-name', name);
	}

	/**
	 * Clear current device
	 *
	 * @return {undefined}
	 */
	clearCurrentDevice() {
		this.setCurrentDevice(null, null);
	}

	/**
	 * Check if a device is currently selected
	 *
	 * @return {Boolean} `true` if there is a device currently selected
	 */
	get hasCurrentDevice() {
		return !!this.getLocal('current-device');
	}

	/**
	 * Get API base URL
	 *
	 * @return {String} API base URL
	 */
	get apiUrl() {
		return this.get('apiUrl');
	}

	/**
	 * Set API base URL. This will change it in profile making it available
	 * in the CLI too.
	 *
	 * @param  {String} apiUrl New API base URL
	 */
	set apiUrl(apiUrl) {
		this.set('apiUrl', apiUrl);
	}

	/**
	 * Get current platform ID
	 *
	 * @return {Number} platform ID
	 */
	get currentTargetPlatform() {
		// Default to a Photon
		let left;
		return (left = this.getLocal('current-target-platform')) != null ? left : 6;
	}

	/**
	 * Set current platform ID
	 *
	 * @param  {Number} platformId New platform ID
	 */
	set currentTargetPlatform(platformId) {
		this.setLocal('current-target-platform', platformId);
	}

	/**
	 * Return list of known platforms
	 *
	 * @readonly
	 * @return {Object} List of platforms where key is platform ID
	 */
	get knownTargetPlatforms() {
		// todo - these are also in particle-commands and particle-cli - consolidate
		return {
			0: {
				name: 'Core',
			},
			6: {
				name: 'Photon',
			},
			8: {
				name: 'P1'
			},
			10: {
				name: 'Electron'
			},
			31: {
				name: 'Raspberry Pi'
			},
			82: {
				name: 'Digistump Oak'
			},
			88: {
				name: 'Redbear Duo'
			},
			103: {
				name: 'Bluz'
			},
			269: {
				name: 'Bluz Gateway'
			},
			270: {
				name: 'Bluz Beacon'
			}
		};
	}

	/**
	 * Get current platform name
	 *
	 * @return {String} Name of the currently selected platform
	 */
	get currentTargetPlatformName() {
		return this.knownTargetPlatforms[this.currentTargetPlatform].name;
	}

	/**
	 * Get instance of `particle-api-js` {Client}, authenticated if possible.
	 * When profile is changed a new instance of the client is required.
	 * It's best to listen for `current-profile-changed` and get the latest
	 * instance then.
	 *
	 * @return {Client} Client instance
	 */
	get apiClient() {
		if (this._apiClient) {
			return this._apiClient;
		}

		let options = {
			auth: this.get('access_token')
		};
		if (this.get('apiUrl')) {
			options.baseUrl = this.get('apiUrl');
		}

		let api = new Api(options);
		this._apiClient = api.client(options);

		return this._apiClient;
	}

	/**
	 * Add callback to specific event
	 *
	 * @param {String}   event    Name of the event
	 * @param {Function} callback Callback to be called when event is triggered
	 * @return {undefined}
	 */
	on(event, callback) {
		this.emitter.on(event, callback);
	}

	_onCurrentTargetPlatformChanged(callback) {
		this.emitter.on('current-target-platform-changed', callback);
	}

	// Decorator which forces settings to be reloaded
	_reloadSettings(callback) {
		this.settings = require('particle-commands').settings.buildSettings(false, {});
		return callback && callback(this.settings);
	}

	_watchConfig() {
		let particleDir = this.settings.ensureFolder();
		let configFile = path.join(particleDir, 'profile.json');

		if (!fs.existsSync(configFile)) {
			fs.writeFileSync(configFile, '{}');
			console.log('Created main config file', configFile);
		}

		this.configWatcher = new File(configFile);
		this.configWatcher.onDidChange(() => {
			this._apiClient = undefined;
			this.emitter.emit('current-profile-changed', this.currentProfile);
			console.log('Profile changed to', this.currentProfile);
		});
	}

	_watchProfile() {
		this.currentProfile;
		let profileFile = this.settings.findOverridesFile();

		if (!fs.existsSync(profileFile)) {
			fs.writeFileSync(profileFile, '{}');
			console.log('Created profile file', profileFile);
		}

		this.profileWatcher = new File(profileFile);
		this.profileWatcher.onDidChange(() => {
			this._apiClient = undefined;
			this.emitter.emit('current-profile-updated');
			console.log('Profile updated');
		});
	}
};
