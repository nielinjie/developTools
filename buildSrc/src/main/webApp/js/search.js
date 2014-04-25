window.searchers=[]

$("#search-input").on("change",function(event){
    var search=$(this).val()
    $(this).val('')
    addSearchText(search)
    applySearches()
})

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
            .addClass("label-searcher-"+s.type)
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
            _(s.fun()).each(function(name){
                $(".nodes-table tbody tr[data-name=\""+name+"\"]").addClass(classes[s.type])
            })
    })

    selectedUpdate()
}