window.searchers=[]
function addSelect(name) {
    var searcher=({
        type:'select',
        fun:function (){
            return [name]
        },
        display:'select: '+name
    })
    window.searchers.push(searcher)
        addSearchToTag(searcher)
}
function addFocus(name) {
    var searcher={
                             type:'select',
                             fun:function() {
                                 return findRelated(name)
                             },
                             display:'focus: '+name

                         }
    window.searchers.push(searcher)
    addSearchToTag(searcher)
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
                display:'search: '+text
            })
             window.searchers.push(searcher)
                    addSearchToTag(searcher)
}

function addSearchToTag(searcher){
    var now=$("#search-input").val()
    $("#search-input").val(now+" "+searcher.display)
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
    _(window.searchers).each(function(s){
            _(s.fun()).each(function(name){
                $(".nodes-table tbody tr[data-name=\""+name+"\"]").addClass(classes[s.type])
            })
    })
    selectedUpdate()
}