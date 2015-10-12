Emitter = null
path = null
settingsPath = null
settings = null
utilities = null

Function::property = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc

module.exports =
	class ProfileManager
		constructor: ->
			{Emitter} = require 'event-kit'
			path = require 'path'
			settingsPath = 'particle-cli/settings.js'
			settings = require settingsPath
			utilities = require 'particle-cli/lib/utilities.js'

			@emitter = new Emitter

		destroy: ->
			@emitter.dispose()

		@property 'profiles',
			get: ->
				particleDir = settings.ensureFolder()
				configFileSuffix = '.config.json'
				files = utilities.globList(null, [
					path.join(particleDir, '*' + configFileSuffix)
				])
				files = files.filter (file) ->
					file.endsWith configFileSuffix
				files = files.map (file) ->
					path.basename(file).replace(configFileSuffix, '')
			set: ->

		@property 'currentProfile',
			get: -> @_reloadSettings ->
				delete require.cache[require.resolve(settingsPath)]
				settings = require settingsPath
				settings.profile

			set: (profile) ->
				settings.switchProfile profile
				@emitter.emit 'current-profile-changed', profile

		# Get key's value
		get: (key) -> @_reloadSettings ->
			settings[key]

			# Set key to value
		set: (key, value) -> @_reloadSettings =>
			settings.override null, key, value
			@emitter.emit key + '-changed', value

		# Get local (current window's) key's value
		getLocal: (key) ->
			if window.localSettings
				return window.localSettings[key]
			null

		# Set local (current window's) key to value
		setLocal: (key, value) ->
			if !window.localSettings
				window.localSettings = {}

			window.localSettings[key] = value
			@emitter.emit key + '-changed', value

		# Set current device's ID and name
		setCurrentDevice: (id, name) ->
			@setLocal 'current-device', id
			@setLocal 'current-device-name', name

		# Clear current core
		clearCurrentDevice: ->
			@setCurrentDevice null, null

		# True if there is current device set
		@property 'hasCurrentDevice',
			get: ->
				!!@getLocal 'current-device'
			set: ->

		# API base URL
		@property 'apiUrl',
			get: ->
				@get 'apiUrl'
			set: (apiUrl) ->
				@set 'apiUrl', apiUrl

		# Current platform ID
		@property 'currentTargetPlatform',
			get: ->
				# Default to a Photon
				@getLocal('current-target-platform') ? 6
			set: (platformId) ->
				@setLocal 'current-target-platform', platformId

		# Known platforms
		@property 'knownTargetPlatforms',
			get: ->
				0:
					name: 'Core',
				6:
					name: 'Photon',
				8:
					name: 'P1'
				10:
					name: 'Electron'
			set: ->

		# Current platform name
		@property 'currentTargetPlatformName',
			get: ->
				@knownTargetPlatforms[@currentTargetPlatform].name
			set: ->

		onCurrentTargetPlatformChanged: (callback) ->
			@emitter.on 'current-target-platform-changed', callback

		on: (event, callback) ->
			@emitter.on event, callback

		# Decorator which forces settings to be reloaded
		_reloadSettings: (callback) ->
			delete require.cache[require.resolve(settingsPath)]
			settings = require settingsPath
			callback()
