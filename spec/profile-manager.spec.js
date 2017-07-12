'use babel';

import { expect } from 'chai';
import ProfileManager from '../src/profile-manager';
import fs from 'fs';
import path from 'path';

function createProfileManager() {
	// use atom is running within the atom test runner
	// or use pathwatcher when running standalone
	const File = require('atom').File || require('pathwatcher').File;
	return new ProfileManager(File);
}

describe('Profile Manager', () => {
	before(() => {
		const profileDir = path.join(__dirname, '.particle');
		function deleteProfileFile(name) {
			try {
				fs.unlinkSync(path.join(profileDir, name));
			} catch (error) {
				if (error.code!=='ENOENT') {
					throw error;
				}
			}
		}
		deleteProfileFile('tmp.config.json');

		fs.writeFileSync(path.join(profileDir, 'profile.json'), '{"name":"particle"}')
	});

	describe('listing profiles', () => {
		it('returns correct profiles', () => {
			process.env.home = __dirname;
			const manager = createProfileManager();

			expect(manager.profiles).to.eql([
				'local', 'particle'
			]);
			expect(manager.profiles.length).to.equal(2);

			expect(manager.currentProfile).to.equal('particle');
			manager.currentProfile = 'local';
			expect(manager.currentProfile).to.equal('local');
			manager.currentProfile = 'particle';
		});
	});

	describe('getting API client', () => {
		it('returns an authenticated instance', () => {
			process.env.home = __dirname;
			const manager = createProfileManager();

			manager.currentProfile = 'particle';
			let client1 = manager.apiClient;

			expect(client1.auth).to.equal(manager.get('access_token'));

			manager.currentProfile = 'local';
			let client2 = manager.apiClient;
			expect(client2.auth).to.equal(manager.get('access_token'));
			expect(client2.api.baseUrl).to.equal(manager.get('apiUrl'));
			expect(client1.auth).not.to.equal(client2.auth);

			manager.currentProfile = 'particle';
		});
	});

	describe('get', () => {
		it('retrieves the value of a variable', () => {
			const manager = createProfileManager();
			manager.currentProfile = 'local';
			expect(manager.get('username')).eql('foo@bar.io');
		});
	});

	describe('set', () => {
		it('sets the value of a variable persistently', () => {
			const manager = createProfileManager();
			manager.currentProfile = 'tmp';
			expect(manager.get('email')).to.eql(undefined);
			const email = 'mat@startup.io';
			manager.set('email', email);
			expect(manager.get('email')).to.eql(email);
		});

		it('gets the previous persisted value', () => {
			const manager = createProfileManager();
			manager.currentProfile = 'tmp';
			const email = 'mat@startup.io';
			expect(manager.get('email')).to.eql(email);
		});
	});
});
