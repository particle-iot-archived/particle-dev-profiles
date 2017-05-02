'use babel';
/* global atom */

import { View } from 'atom-space-pen-views';
let CompositeDisposable = null;
let SelectTargetPlatformView = null;

export default class ProfilesTile extends View {
	static content() {
		return this.span({ class: 'inline-block' }, () => {
			return this.span({ type: 'button', class: 'icon icon-milestone inline-block', outlet: 'targetPlatform' }, 'Unknown');
		});
	}

	initialize(statusBar, profileManager) {
		this.statusBar = statusBar;
		this.profileManager = profileManager;
		({ CompositeDisposable } = require('atom'));

		this.subscriptions = new CompositeDisposable();

		// On click handler
		this.targetPlatform.on('click', () => {
			if (typeof SelectTargetPlatformView === 'undefined' || SelectTargetPlatformView === null) {
				SelectTargetPlatformView = require('./select-target-platform-view');
			}
			if (this.selectTargetPlatformView == null) {
				this.selectTargetPlatformView = new SelectTargetPlatformView(this.profileManager);
			}
			return this.selectTargetPlatformView.show();
		});

		// Tooltip
		this.subscriptions.add(atom.tooltips.add(this.targetPlatform, { title: 'Click to change target platform' }));

		// Change current platform handler
		this.profileManager._onCurrentTargetPlatformChanged(newTargetPlatform => {
			return this.targetPlatform.text(this.profileManager.knownTargetPlatforms[newTargetPlatform].name);
		});
		this.targetPlatform.text(this.profileManager.currentTargetPlatformName);

		return this.attach();
	}

	attach() {
		return this.statusBar.addLeftTile({ item: this, priority: 200 });
	}

	detached() {
		return __guard__(this.subscriptions, x => x.dispose());
	}
}

function __guard__(value, transform) {
	return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
