'use babel';

import {expect} from 'chai';
import ProfileManager from '../src/profile-manager';

describe('Profile Manager', () => {
	describe('listing profiles', () => {
		it('returns correct profiles', () => {
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

	describe('getting API client', () => {
		it('returns an authenticated instance', () => {
			process.env.home = __dirname;
			let manager = new ProfileManager();

			manager.currentProfile = 'particle';
			let client1 = manager.apiClient;
			expect(client1.auth).to.equal(manager.get('access_token'));

			manager.currentProfile = 'local';
			let client2 = manager.apiClient;
			expect(client2.auth).to.equal(manager.get('access_token'));

			expect(client1.auth).not.to.equal(client2.auth);

			manager.currentProfile = 'particle';
		});
	});
});
