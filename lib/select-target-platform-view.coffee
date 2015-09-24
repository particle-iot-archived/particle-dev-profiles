{SelectView} = require 'particle-dev-views'

$$ = null

module.exports =
class SelectTargetPlatformView extends SelectView
  initialize: (@profileManager) ->
    super

    {$$} = require 'atom-space-pen-views'
    @prop 'id', 'particle-dev-select-port-view'

  show: =>
    items = []
    for k, v of @profileManager.knownPlatformTargets
      v.id = k
      items.push v
    @setItems items
    super

  viewForItem: (item) ->
     $$ -> @li(item.name)

  confirmed: (item) ->
    @hide()
    @profileManager.currentPlatformTarget = item.id

  getFilterKey: ->
    'name'
