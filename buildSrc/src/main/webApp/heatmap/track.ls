window.track=(path)->
  dateFormat=d3.time.format \%Y%m%d.%H%M%S
  data=_(origindata).find ->
    it.path - /\\/g  - /\./g ==path
  .logs
  data=_(data).map ->
    ^^it <<< date: dateFormat.parse it.date
  dates=_(data) .pluck \date
  authors=_.chain data .pluck \author .map ->
    it.toUpperCase!
  .uniq! .value!
  xs=d3.time.scale!.domain [window.minDate, new Date()] .range [0 600]
  ys=d3.scale.ordinal! .domain authors .rangePoints([0, 300],0.2)
  axisx=d3.svg.axis().scale(xs).orient(\bottom) .ticks(d3.time.years, 1)
  axisy=d3.svg.axis().scale(ys).orient(\right)

  svg=d3.selectAll ".file-track[attr-name='#path']" .append \svg
  .attr \width \650px
  .attr \height \350px

  svg.append \g
  .attr("transform", "translate(10,320)")
  .call axisx .attr \fill \steelblue
  svg.append \g
  .attr("transform", "translate(0,10)")
  .call axisy .attr \fill \steelblue
  svg.append \g
  .attr("transform", "translate(10,10)")
  .selectAll \.track-point .data data .enter! .append \circle
  .attr \r 3
  .attr \fill \darkred
  .attr \cx -> 0
  .attr \cy -> ys it.author.toUpperCase!
  .transition! .attr \cx -> xs it.date
