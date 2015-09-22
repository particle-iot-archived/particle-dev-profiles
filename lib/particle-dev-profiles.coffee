{CompositeDisposable} = require 'atom'

module.exports = ParticleDevProfiles =
  subscriptions: null

  activate: (state) ->
    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # @subscriptions.add atom.commands.add 'atom-workspace', 'particle-dev-profiles:toggle': => @toggle()

  deactivate: ->
    @subscriptions.dispose()

  serialize: ->

  consumeStatusBar: (statusBar) ->
    @statusBar = statusBar
