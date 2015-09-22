path = require 'path'
ProfileManager = require '../lib/profile-manager.coffee'

describe 'Profile Manager', ->
	describe 'listing profiles', ->
		it 'returns correct profiles', ->
			process.env.home = __dirname
			manager = new ProfileManager

			expect(manager.profiles.length).toEqual 2
			expect(manager.profiles).toEqual [
				'local', 'particle'
			]

			expect(manager.currentProfile).toEqual 'particle'
			manager.currentProfile = 'local'
			expect(manager.currentProfile).toEqual 'local'
			manager.currentProfile = 'particle'
