CompositeDisposable = null
ProfileManager = null

module.exports = ParticleDevProfiles =
  subscriptions: null

  activate: (state) ->
    {CompositeDisposable} = require 'atom'
    ProfileManager = require './profile-manager'

    @subscriptions = new CompositeDisposable
    @profileManager = new ProfileManager()
    # @subscriptions.add atom.commands.add 'atom-workspace', 'particle-dev-profiles:toggle': => @toggle()

  deactivate: ->
    @subscriptions.dispose()

  serialize: ->

  consumeStatusBar: (statusBar) ->
    @statusBar = statusBar

    ProfilesTile = require './profiles-tile'
    new ProfilesTile(@statusBar, @profileManager)

  provideParticleDevProfiles: ->
    @profileManager
