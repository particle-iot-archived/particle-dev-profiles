{Emitter} = require 'event-kit'
path = require 'path'
settingsPath = 'particle-cli/settings.js'
settings = require settingsPath
utilities = require 'particle-cli/lib/utilities.js'

Function::property = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc

module.exports =
	class ProfileManager extends Emitter
		constructor: ->

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
				@emit 'current-profile-changed', profile

			# Set key to value
		set: (key, value) -> @_reloadSettings =>
			settings.override null, key, value
			@emit 'key-changed',
				key: key
				value: value

		# Get key's value
		get: (key) -> @_reloadSettings ->
			settings[key]

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

		# Set current device's ID and name
		setCurrentDevice: (id, name) ->
			@setLocal 'current_device', id
			@setLocal 'current_device_name', name
			@emit 'current-device-changed', name

		# Clear current core
		clearCurrentDevice: ->
			@setCurrentDevice null, null

		# True if there is current device set
		@property 'hasCurrentCore',
			get: ->
				!!@getLocal('current_core')
			set: ->

		# API base URL
		@property 'apiUrl',
			get: ->
				@getLocal('apiUrl')
			set: (apiUrl) ->
				@set 'apiUrl', apiUrl

		# Decorator which forces settings to be reloaded
		_reloadSettings: (callback) ->
			delete require.cache[require.resolve(settingsPath)]
			settings = require settingsPath
			callback()
