{View} = require 'atom-space-pen-views'
CompositeDisposable = null
SelectTargetPlatformView = null

module.exports =
class ProfilesTile extends View
	@content: ->
		@span class: 'inline-block', =>
			@span type: 'button', class: 'icon icon-milestone inline-block', outlet: 'platformTarget', 'Unknown'

	initialize: (@statusBar, @profileManager) ->
		{CompositeDisposable} = require 'atom'

		@subscriptions = new CompositeDisposable()

		@subscriptions.add @platformTarget.on 'click', =>
			SelectTargetPlatformView ?= require './select-target-platform-view'
			@selectTargetPlatformView ?= new SelectTargetPlatformView(@profileManager)
			@selectTargetPlatformView.show()
		@subscriptions.add atom.tooltips.add(@platformTarget, title: 'Click to change target platform')

		@subscriptions.add @profileManager.onCurrentPlatformTargetChanged (newPlatformTarget) =>
			@platformTarget.text @profileManager.knownPlatformTargets[newPlatformTarget].name
		@platformTarget.text @profileManager.currentPlatformTargetName

		@attach()

	attach: ->
		@statusBar.addLeftTile(item: @, priority: 200)

	detached: ->
		@subscriptions?.dispose()
