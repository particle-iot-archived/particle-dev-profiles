'use babel';

import { SelectView } from 'particle-dev-views';

let $$ = null;

export default class SelectTargetPlatformView extends SelectView {
	constructor(...args) {
		super(...args);
		this.show = this.show.bind(this);
	}

	initialize(profileManager) {
		this.profileManager = profileManager;
		super.initialize(...arguments);

		({ $$ } = require('atom-space-pen-views'));
		return this.prop('id', 'particle-dev-select-target-platform-view');
	}

	show() {
		let items = [];
		for (let k in this.profileManager.knownTargetPlatforms) {
			let v = this.profileManager.knownTargetPlatforms[k];
			v.id = parseInt(k);
			items.push(v);
		}
		this.setItems(items);
		return super.show(...arguments);
	}

	viewForItem(item) {
		return $$(function view() {
			return this.li(item.name);
		});
	}

	confirmed(item) {
		this.hide();
		return this.profileManager.currentTargetPlatform = item.id;
	}

	getFilterKey() {
		return 'name';
	}
}
