_=require \underscore

endsWith = (str,suffix) ->
   str.indexOf(suffix, str.length - suffix.length) != -1;
contains =(str,part) ->
  re=(str.indexOf part) != -1
output=console.log

module.exports.summary=(total,used)->
  output("total recorders - #total")
  output("developing recorders - #used")

module.exports.javaTouchTop=(datas,rowNum)->
  output "JAVA TOUCHED TOP #rowNum"
  (_(datas).chain!
  .filter ->
    endsWith(it.path,\.java)
  .countBy ->
      it.path - '"'
  .pairs!
  .sortBy  -> -it[1]
  .head rowNum
    ..each ->
      output "#{it[0]} - #{it[1]}")
  .value!

module.exports.fileTouchTop=(datas,rowNum)->
  output "FILE TOUCHED TOP 100"
  _(datas).chain!.countBy ->
      it.path - '"'
  .pairs!
  .sortBy  -> -it[1]
  .head rowNum
  .each ->
    output "#{it[0]} - #{it[1]}"

module.exports.byAuthor=(datas) ->
  output "CODER BY TOUCHED"
  _(datas).chain!.countBy ->
    it.author.toUpperCase! - "'"
  .pairs!
  .sortBy  -> -it[1]
  .each ->
    output "#{it[0]} - #{it[1]}"

module.exports.touchAndComplex=(jTop,complexTop,datas)->
  j200=_(jTop)
  complex=complexTop
  com=_.chain(complex).map ->
    short=it[0]
    matched=j200.filter ->
      contains(it[0],"\\#{short}.java")
    {name: short,complexity: +it[1]} <<< do
      switch matched.length
      | 0 =>
        stat: \no-touch
      | 1 =>
        stat: \match
        touch: matched[0][1]
        path: matched[0][0]
      | _ =>
        stat: \duplicated
        matched: matched
  touch=_.chain(j200).map ->
    path=it[0]
    logs=_(datas).chain!.filter ->
      it.path==path
    .map ->
      _(it).omit [\path]
    .value!
    matched=complex.filter ->
      contains(path,"\\#{it[0]}.java")
    {path,logs,touch: +it[1]} <<< do
      switch matched.length
      | 0 =>
        stat: \no-complex
      | 1 =>
        stat: \match
        complexity: +matched[0][1]
      | _ =>
        stat: \duplicated
        matched: matched

  matched=_.chain(touch).filter ->
    it.stat=='match'
  .map ->
    it <<< CT: (it.touch * it.complexity)
  .value!



  both=_(matched).chain!
  .sortBy ->
    -it.CT

  output "Touch And complex - #{both.size!.value!}"
  both.each ->
    output "#{it.path} - #{it.CT}ct = #{it.touch}t*#{it.complexity}c"

  noTouch=_.chain(com).filter ->
    it.stat==\no-touch
  .sortBy ->
    -it.complexity

  output "Complex no touch - #{noTouch.size!.value!}"

  noTouch.each ->
    output "#{it.name} - #{it.complexity}c"



  noCom=_.chain(touch).filter ->
    it.stat==\no-complex
  .sortBy ->
    -it.touch

  output "Touch no complex - #{noCom.size!.value!}"

  noCom.each ->
    output "#{it.path} - #{it.touch}t"
  {both:both.value!, noTouch:noTouch.value!,noComplex:noCom.value!}

module.exports.touchAndComplexByAuthor=(datas,tAndC)->
  _(tAndC).each ->
    path=it.path
    logs=datas.filter ->
      it.path==path
    authors= _(logs).chain!.countBy ->
      it.author.toUpperCase!
    .pairs!.sortBy ->
      -it[1]
    .map -> it.join ': '
    .value!

    output "#{it.path} - #{it.CT}ct = #{it.touch}t*#{it.complexity}c"
    output _(authors).join '  '