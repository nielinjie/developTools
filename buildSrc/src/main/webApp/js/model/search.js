window.searchers=[]

$("#search-input").on("change",function(event){
    var search=$(this).val()
    $(this).val('')
    addSearchText(search)
    applySearches()
})

$(".searcher-clean").on("click",function(e){
    window.searchers=[]
    refreshSearcherBox()
    applySearches()
})

function addMultiSelect(names,displayName) {
    var searcher=({
        type:'select',
        fun:function (){
            return names
        },
        display:'<i class="fa fa-hand-o-up"/> '+displayName,
        id:_.uniqueId('searcher')
    })
    window.searchers.push(searcher)
        refreshSearcherBox()
}

function addSelect(name) {
    var searcher=({
        type:'select',
        fun:function (){
            return [name]
        },
        display:'<i class="fa fa-hand-o-up"/> '+name,
        id:_.uniqueId('searcher')
    })
    window.searchers.push(searcher)
        refreshSearcherBox()
}
function addMarker(marker) {
    var searcher=({
            type:'marker',
            fun:function (){
                return marker.fun()
            },
            marker:marker,
            display:'<i class="fa fa-tags"/> '+marker.briefUI().text,
            style:{"background-color":marker.briefUI().color},
            id:_.uniqueId('searcher')
        })
        window.searchers.push(searcher)
         refreshSearcherBox()
}
function addBubble(bubble) {
    var searcher=({
            type:'bubble',
            fun:function (){
                return bubble.fun()
            },
            marker:bubble,
            display:'<i class="fa fa-circle-o"/> '+bubble.briefUI().text,
            style:{"background-color":bubble.briefUI().color},
            id:_.uniqueId('searcher')
        })
        window.searchers.push(searcher)
         refreshSearcherBox()
}
function addFocus(name) {
    var searcher={
                             type:'select',
                             fun:function() {
                                 return _(findRelated(name)).cat(name)
                             },
                             display:'<i class="fa fa-crosshairs"/> '+name,
        id:_.uniqueId('searcher')

                         }
    window.searchers.push(searcher)
    refreshSearcherBox()
}
function addMultiFocus(names,displayName){
  var searcher=({
      type:'select',
      fun:function (){
          return _(names).chain().map(function(n){
            return findRelated(n)
          }).flatten().cat(names).uniq().value()
      },
      display:'<i class="fa fa-crosshairs"/> '+displayName,
      id:_.uniqueId('searcher')
  })
  window.searchers.push(searcher)
      refreshSearcherBox()
}
function addSearchText(text) {
    var searcher=({
                type:'display',
                fun:function (){
                    var domain=window.domain
                    return _(domain.functions).chain().union(domain.entities)
                    .pluck("name")
                    .filter(function(n){
                        return n.indexOf(text)!=-1
                    }).value()
                },
                display:'<i class="fa fa-search"/> '+text,
                        id:_.uniqueId('searcher')

            })
             window.searchers.push(searcher)
                    refreshSearcherBox()
}

function refreshSearcherBox(){
    $(".searcher-box").empty()
    _(window.searchers).each(function(s){
        var label=$("<span class='label searcher-label'/>")
            .addClass("label-searcher-"+s.type).css(s.style?s.style:{})
            .html(s.display)
            .attr('data-id',s.id)
        $(".searcher-box").append(label).append(' ')
        label.on("click",function(e){
            var id=$(this).attr('data-id')
            window.searchers=_(window.searchers).reject(function(s){return s.id==id})
            refreshSearcherBox()
            applySearches()
        })
    })
}
function resetTable(){
    $(".nodes-table tbody tr").removeClass("selected").removeClass("displayed")
    $(".nodes-table tbody td.markers").empty()
}
function applySearches(){
    resetTable()
    var classes={
        select:'selected',
        display:'displayed'
    }
    $(".nodes-table tbody tr").removeClass("selected")
    //For non-display searcher.
    if (_(window.searchers).any(function(s){
        return s.type == 'display'
    })){
        $(".nodes-table tbody tr").removeClass("displayed")
    }else{
        $(".nodes-table tbody tr").addClass("displayed")
    }
    //
_(window.searchers).each(function(s){

                if(s.type !="marker"  && s.type !="bubble"){
                    _(s.fun()).each(function(name){
                        $(".nodes-table tbody tr[data-name=\""+name+"\"]").addClass(classes[s.type])
                    })
                }else{
                    _(s.fun()).each(function(ma){
                        var marker=$("<span class='label'/>").css(ma.css).text(ma.text)
                        $(".nodes-table tbody tr[data-name=\""+ma.name+"\"] td.markers").append(marker)
                    })
                }})

    selectedUpdate()
    _(window.searchers).each(function(s){
                if(s.type =="marker"){

                    _(s.fun()).each(function(ma){
                        var text=d3.select("g[data-name=\""+ma.name+"\"] g")
                        var c=text.selectAll("circle")
                        var siblingCount = c[0]?c[0].length:0
                        text.append("circle").style(ma.css)
                          .attr("r",100)
                          .style("opacity", 0.2)
                          .attr("cx",siblingCount*5)
                          .transition()
                          .delay(function(d){return _.random(0, 400);})
                          .attr("r",5)
                          .style("opacity",0.8)
                    })
                }else if (s.type =="bubble"){
                  _(s.fun()).each(function(ma){
                      var r=ma.factor*100
                      var g=d3.select("g[data-name=\""+ma.name+"\"]")
                      g.append("circle").classed("bubble",true).style(ma.css)
                        .style("opacity", 0.2)
                        .attr("r",5)
                        .transition()
                        .delay(function(d){return _.random(0, 400);})
                        .duration(function(d){return _.random(400, 800);})
                        .attr("r",r)
                        .style("opacity",0.4)
                  })
                }
        })
}
