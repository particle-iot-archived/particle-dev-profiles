'use babel';

import path from 'path';
import ProfileManager from '../lib/profile-manager';

describe('Profile Manager', () =>
	describe('listing profiles', () =>
		it('returns correct profiles', function() {
			process.env.home = __dirname;
			let manager = new ProfileManager();

			expect(manager.profiles.length).toEqual(2);
			expect(manager.profiles).toEqual([
				'local', 'particle'
			]);

			expect(manager.currentProfile).toEqual('particle');
			manager.currentProfile = 'local';
			expect(manager.currentProfile).toEqual('local');
			return manager.currentProfile = 'particle';
		}
		)

	)

);
