'use babel';

import {expect} from 'chai';
import path from 'path';
import ProfileManager from '../src/profile-manager';

describe('Profile Manager', () => {
	describe('listing profiles', () => {
		it('returns correct profiles', function() {
			process.env.home = __dirname;
			let manager = new ProfileManager();

			expect(manager.profiles.length).to.equal(2);
			expect(manager.profiles).to.eql([
				'local', 'particle'
			]);

			expect(manager.currentProfile).to.equal('particle');
			manager.currentProfile = 'local';
			expect(manager.currentProfile).to.equal('local');
			manager.currentProfile = 'particle';
		});
	});
});
