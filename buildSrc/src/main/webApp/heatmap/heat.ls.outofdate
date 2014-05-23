

color= (maxTouch) ->
  d3.scale.linear().domain([0, maxTouch]).range([\white, \red])



window.render=(xselect,yselect) ->
  modules=new RegExp(xselect)#/\\(service|view|controller|bo|dao)\\/
  modules2=new RegExp(yselect)#/(Oper|Mail|Common|Task|File|BBEOA|AutoFlow)/
  groups=_(origindata).chain!.groupBy ->
    [(modules.exec( it.path) ? [\p '(null)'] ) .[1],
    (modules2.exec( it.path) ? [\p '(null)'] ) .[1]]
  .map (v,k)->
    [nx,ny]=k.split(\,)
    children=_(v).map ->
      name: it.path
      comp: it.complexity
      touch: it.touch
      logs: it.logs
    {nx,ny,children}
  .value!

  maxTouch=_(origindata).max ->
    it.touch
  .touch
  maxComp=_(groups).chain!.map ->
    _(it.children).reduce ->
      &0+&1.comp
    ,0
  .max!.value!
  datas=groups



  xs=d3.scale.ordinal().domain(_(groups).chain!.pluck \nx  .sortBy _.identity .value! ).rangeBands([0, 1120],0.2,0.2)
  ys=d3.scale.ordinal().domain(_(groups).chain!.pluck \ny  .sortBy _.identity .value! ).rangeBands([0, 800],0.2,0.2)
  sizefx=d3.scale.linear().domain([0,maxComp ^ 0.5 ]).range([0,xs.rangeBand!])
  sizefy=d3.scale.linear().domain([0,maxComp ^ 0.5 ]).range([0,ys.rangeBand!])
  axisx=d3.svg.axis().scale(xs).orient(\bottom)
  axisy=d3.svg.axis().scale(ys).orient(\right)


  layout=(sizex,sizey)->d3.layout.treemap().children ->
    it.children
  .value ->
    it.comp
  .size [sizex, sizey]


  svg=d3.select \.drawing .append \svg .attr \width , \1140px .attr \height , \900px
  svg.append("g")
    .attr("transform", "translate(10,800)")
    .call(axisx).attr \fill \steelblue
  svg.append(\g)
  .attr("transform", "translate(10,10)")
  .call(axisy).attr \fill \steelblue
  svg.append \g
  .attr("transform", "translate(10,10)")
  .selectAll \.package .data datas .enter! .append \g
  .attr \class , \package
  .attr \transform , "translate(600 400)"
    ..transition! .duration 400ms
    .attr \transform , ->
      "translate(#{xs(it.nx)} #{ys(it.ny)})"

    ..attr \stroke \black
      .selectAll \rect
      .data (n)->
        total=_(n.children).map ->
          it.comp
        .reduce (+) ,0
        total1=total ^ 0.5
        layout(sizefx(total1),sizefy(total1)) (n)
        n.children
      .enter! .append \rect
      .attr \x -> 0
      .attr \y -> 0
      .attr \width -> it.dx
      .attr \height -> it.dy
      .attr 'attr-name' -> it.name - /\\/g  - /\./g
      .attr 'attr-path' -> it.name
      .attr \class \file
      .attr \fill \lightgray
        ..transition! .delay 400ms .duration 400ms .attr \x ->
          it.x
        .attr \y -> it.y
#        ..transition! .delay 800ms .duration 400ms
#        .attr \fill ->
#           color(maxTouch)(it.touch)

        ..append \svg:title .text -> "#{it.name} -\n C:#{it.comp},\n T:#{it.touch}"
window.minDate= do
    dateFormat=d3.time.format \%Y%m%d.%H%M%S
    _.chain(origindata).map ->
      it.logs
    .flatten!.map ->
      dateFormat.parse it.date
    .min!.value!
window.timeFilter =({ timeFi, weight })->
  dateFormat=d3.time.format \%Y%m%d.%H%M%S
  touch = ->
    logs = if not timeFi? then
      it.logs
    else
      _(it.logs).filter ->
        dateFormat.parse(it.date) >= timeFi
    logs.length

  linear = (minDate) ->
    d3.time.scale!.domain([minDate,new Date()]).range([0,1])

  pow = (minDate) ->
    months=d3.time.month.range(minDate,new Date()).length >? 1
    x1 = d3.time.scale!.domain([minDate,new Date()]).range([0,months])
    x2 = d3.scale.pow!.domain([0,months]).range([0,1]).exponent 2
    x1 >> x2

  weightedTouch = (it) ->
    w=switch weight
    | \linear => linear(timeFi ? minDate)
    | \pow => pow(timeFi ? minDate)
    | _ => -> 1

    logs = if not timeFi? then
      it.logs
    else
      _(it.logs).filter ->
        dateFormat.parse(it.date) >= timeFi
    _(logs).reduce ->
#      console.log dateFormat.parse(&1.date)
      wd=w(dateFormat.parse(&1.date))
      &0+wd
    ,0


  touchs=_(origindata).map ->
    weightedTouch it
  maxTouch=_(touchs).max!
  d3.selectAll \.file .transition! .duration 400ms .attr \fill ->
    color(maxTouch)(weightedTouch(it))
  .select \title .text ->

    "#{it.name} -\n C:#{it.comp},\n T:#{it.touch} - filtered:#{touch(it)} - weighted:#{weightedTouch(it)}"

#window.tend = (file) ->









