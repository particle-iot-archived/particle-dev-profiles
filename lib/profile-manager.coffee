{Emitter} = require 'event-kit'
path = require 'path'
settings = require 'particle-cli/settings.js'
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
			get: ->
				settings.whichProfile()
				settings.loadOverrides()
				settings.profile

			set: (profile) ->
				settings.switchProfile profile
