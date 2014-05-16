


$(function(){
    reloadDomain()
})

$(".reload").on("click",function(e){
    reloadDomain()
})

$(".source").on("click",function(e){
    alert("Not Implemented...")
})

$(".n-table-side").on("mouseover",function(e){
    $(".svg").removeClass('col-lg-8').addClass('col-lg-4')
    $(".n-table-side").removeClass('col-lg-4').addClass('col-lg-8')
}).on("mouseleave",function(e){
      $(".svg").removeClass('col-lg-4').addClass('col-lg-8')
      $(".n-table-side").removeClass('col-lg-8').addClass('col-lg-4')
  })

function reloadDomain(){
    $(".reload").addClass("disabled")
    $(".reload i").addClass("fa-spin")
    $.getJSON('./domains',function(data){
        window.domain=data[0]
        filter(window.domain)
        filterTable(window.domain)
        $(".reload").removeClass("disabled")
        $(".reload i").removeClass("fa-spin")
    })
}





function byName(name){
    return function(graph){
        return {nodes: _(graph.nodes).filter(function(n){
            return n.name.indexOf(name)!=-1
        })}
    }
}

function byNames(names){
    return function(graph){
            var nodes=_(graph.nodes).filter(function(n){
                                      return _(names).contains(n.name)
                                      })
            return {
                nodes: nodes
                ,
                links:findByNodes(graph.links,nodes)
            }
        }
}





function findByNodes(links,nodes){
    return _(links).filter(function(l){
        return _(nodes).contains(l.source) && _(nodes).contains(l.target)
    })
}
function selectedUpdate() {
    var selected = _($(".nodes-table tbody tr.selected")).map(function(e){return $(e).attr("data-name")})
    if(selected.length!=0)
        filter(window.domain,byNames(selected))
    else
        filter(window.domain)
}
function setSelected(names){
    _(names).each(function(n){
        $(".nodes-table tbody tr[data-name=\""+n+"\"]").addClass("selected")
    })
    selectedUpdate()
}