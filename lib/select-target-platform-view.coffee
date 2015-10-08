{SelectView} = require 'particle-dev-views'

$$ = null

module.exports =
class SelectTargetPlatformView extends SelectView
  initialize: (@profileManager) ->
    super

    {$$} = require 'atom-space-pen-views'
    @prop 'id', 'particle-dev-select-target-platform-view'

  show: =>
    items = []
    for k, v of @profileManager.knownTargetPlatforms
      v.id = k
      items.push v
    @setItems items
    super

  viewForItem: (item) ->
     $$ -> @li(item.name)

  confirmed: (item) ->
    @hide()
    @profileManager.currentTargetPlatform = item.id

  getFilterKey: ->
    'name'
