'use babel';

let Emitter = null;
let path = null;
let settingsPath = null;
let settings = null;
let utilities = null;

export default class ProfileManager {
		constructor() {
			({Emitter} = require('event-kit'));
			path = require('path');
			settingsPath = 'particle-cli/settings.js';
			settings = require(settingsPath);
			utilities = require('particle-cli/lib/utilities.js');

			this.emitter = new Emitter();
		}

		destroy() {
			return this.emitter.dispose();
		}

		get profiles() {
			let particleDir = settings.ensureFolder();
			let configFileSuffix = '.config.json';
			let files = utilities.globList(null, [
				path.join(particleDir, `*${configFileSuffix}`)
			]);
			files = files.filter(file => file.endsWith(configFileSuffix));
			return files = files.map(file => path.basename(file).replace(configFileSuffix, ''));
		}

		get currentProfile() { return this._reloadSettings(function() {
			delete require.cache[require.resolve(settingsPath)];
			settings = require(settingsPath);
			return settings.profile;
		}); }

		set currentProfile(profile) {
			settings.switchProfile(profile);
			return this.emitter.emit('current-profile-changed', profile);
		}

		// Get key's value
		get(key) { return this._reloadSettings(() => settings[key]); }

		// Set key to value
		set(key, value) { return this._reloadSettings(() => {
			settings.override(null, key, value);
			return this.emitter.emit(key + '-changed', value);
		}
		); }

		// Get local (current window's) key's value
		getLocal(key) {
			if (window.localSettings) {
				return window.localSettings[key];
			}
			return null;
		}

		// Set local (current window's) key to value
		setLocal(key, value) {
			if (!window.localSettings) {
				window.localSettings = {};
			}

			window.localSettings[key] = value;
			return this.emitter.emit(key + '-changed', value);
		}

		// Set current device's ID and name
		setCurrentDevice(id, name) {
			this.setLocal('current-device', id);
			return this.setLocal('current-device-name', name);
		}

		// Clear current core
		clearCurrentDevice() {
			return this.setCurrentDevice(null, null);
		}

		get hasCurrentDevice() {
			return !!this.getLocal('current-device');
		}

		// API base URL
		get apiUrl() {
			return this.get('apiUrl');
		}

		set apiUrl(apiUrl) {
			return this.set('apiUrl', apiUrl);
		}

		// Current platform ID
		get currentTargetPlatform() {
			// Default to a Photon
			let left;
			return (left = this.getLocal('current-target-platform')) != null ? left : 6;
		}

		set currentTargetPlatform(platformId) {
			return this.setLocal('current-target-platform', platformId);
		}

		// Known platforms
		get knownTargetPlatforms() {
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

		// Current platform name
		get currentTargetPlatformName() {
			return this.knownTargetPlatforms[this.currentTargetPlatform].name;
		}

		onCurrentTargetPlatformChanged(callback) {
			return this.emitter.on('current-target-platform-changed', callback);
		}

		on(event, callback) {
			return this.emitter.on(event, callback);
		}

		// Decorator which forces settings to be reloaded
		_reloadSettings(callback) {
			delete require.cache[require.resolve(settingsPath)];
			settings = require(settingsPath);
			return callback();
		}
	};
