'use babel';

let CompositeDisposable = null;
let ProfileManager = null;

export default {
	subscriptions: null,

	activate(state) {
		({ CompositeDisposable } = require('atom'));
		ProfileManager = require('./profile-manager');

		this.subscriptions = new CompositeDisposable();
		return this.profileManager = new ProfileManager();
	},

	deactivate() {
		return this.subscriptions.dispose();
	},

	serialize() {},

	consumeStatusBar(statusBar) {
		this.statusBar = statusBar;

		let ProfilesTile = require('./profiles-tile');
		return new ProfilesTile(this.statusBar, this.profileManager);
	},

	provideParticleDevProfiles() {
		return this.profileManager;
	}
};
