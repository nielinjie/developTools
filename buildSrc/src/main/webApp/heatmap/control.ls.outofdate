$ ->
  $ \.help .popover do
    content: $ \#help .html!
    html: true
    placement: \auto
    title: '帮助'

  $ \.help-split .popover do
    content: $ \#help-split .html!
    html: true
    placement: \auto
    title: '帮助'
  .on 'shown.bs.popover' ->
    v=$ @ .next \.popover .find \i.send .click ->
      if $ \.x .val! =='' then
        $ \.x .val <| $ @ .data \code
      else
        $ \.y .val <| $ @ .data \code

  times=
    * \最早 void
    * \三年 d3.time.year.offset(new Date, -3)
    * \两年 d3.time.year.offset(new Date, -2)
    * \一年 d3.time.year.offset(new Date, -1)
    * \半年 d3.time.month.offset(new Date, -6)
    * \三个月 d3.time.month.offset(new Date, -3)
    * \一个月 d3.time.month.offset(new Date, -1)
    * \现在 , new Date

  $ \#slider .slider do
    max: 7
    min:0
    value:0
    formater: ->
      times .[it].join \-
  .on 'slideStop', ->
    timeFilter status!
    $ \.timeFilter .text times.[it.value].[0]


  status=(weight) ->
    time=$ \#slider .slider \getValue
    timeFi=times .[time] .1
    weight ?= $ '.wight .btn.active input' .data \kind
    {timeFi,weight}

  $ \.right .click ->
    value=$ \#slider .slider \getValue
    if value<=6 then
      value=value+1
      $ \#slider .slider \setValue value
      $ \.timeFilter .text times.[value].[0]
      timeFilter(status!)

  $ \.left .click ->
    value=$ \#slider .slider \getValue
    if value>=1 then
      value=value-1
      $ \#slider .slider \setValue value
      $ \.timeFilter .text times.[value].[0]
      timeFilter(status!)

  $ '.wight .btn' .click ->
    timeFilter(status <| $ @ .data \kind)


  $ '.drawing' .popover do
      selector: 'rect.file'
      placement: \right
      container: \body
      html: true
      content: ->
        copy= $ '#file-pop' .clone! .removeAttr \id .removeClass \hide
        copy .find \.desc .html "#{$ @ .find \title .text! .replace /\n/g '<br/>'}"
        copy .find \.file-track .attr \attr-name ($ @ .attr \attr-name) .end! .[0] .outerHTML
  .on 'shown.bs.popover' ->
    path = $ it.target .attr \attr-name
    window.track path


  $ \.redraw .click ->
    value=$ \#slider .slider \getValue
    timeF= times .[value] .[1]
    $ \svg .remove!
    render($ '.control .x' .val! , $ '.control .y' .val! )
    setTimeout ->
      timeFilter(status!)
    , 800ms


  if not origindata? or origindata.length ==0 then
    $ \.data-warning .removeClass \hide
    $ \.redraw .addClass \disabled
  else
    value=$ \#slider .slider \getValue
    timeF= times .[value] .[1]
    $ \svg .remove!
    render($ '.control .x' .val! , $ '.control .y' .val! )
    setTimeout ->
      timeFilter(status!)
    , 800ms
