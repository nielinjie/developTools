
function updateTable(graph){
    $(".nodes-table tbody").empty()
    _(graph.nodes).each(function(n){
        var tr=$("<tr/>").attr("data-name",n.name)
        tr.addClass("displayed")

        var td=$("<td/>").append($("<span>").addClass("label").addClass("label-"+n.type).text(n.type =="function"?"F":"E"))
        tr.append(td)
        tr.append($("<td/>").text(n.name))
        tr.append($("<td class='markers'/>"))
        var button=$("<button type='button' class='btn btn-default btn-xs'>Focus. </button>").attr("data-name",n.name)
        button.append($("<i/>").addClass("fa fa-crosshairs"))
        var td2=$("<td>").append(button)
        tr.append(td2)
        $(".nodes-table tbody").append(tr)
    })
    $(".nodes-table tbody tr button.btn").on("click", function(e){
            e.stopPropagation()
            var name=$(this).attr("data-name")
//            var names=findRelated(name)
//            setSelected(_(names).union([name]))
            addFocus(name)
            applySearches()
        })
    $(".nodes-table tbody tr").on("click", function(e){
         e.stopPropagation()
                    var name=$(this).attr("data-name")
        //            var names=findRelated(name)
        //            setSelected(_(names).union([name]))
                    addSelect(name)
                    applySearches()
    })

    $(".nodes-table tbody tr").hover(
                                function() {
                                  $( this ).addClass( "hover" );
                                  //TODO jquery don't support svg
                                  $("g.node[data-name=\""+$(this).attr("data-name")+"\"]").addClass("hover")
                                }, function() {
                                  $( this ).removeClass( "hover" );
                                  //TODO jquery don't support svg
                                  $("g.node[data-name=\""+$(this).attr("data-name")+"\"]").removeClass("hover")

                                }
                              );
}
function filterTable(domain){
      updateTable(domainToGraph(domain))
}

function reorderTable(campFun) {
    var tb=$(".nodes-table tbody")
    var trs=tb.children("tr").detach().sort(function(la,lb){
        return campFun($(la).attr("data-name"),$(lb).attr("data-name"))
    })
    tb.append(trs)
}
function domainToGraph(domain){
    var graph = {}
        graph.nodes=[]
        _(domain.functions).each(
            function(f){
                graph.nodes.push( {
                    name:f.name,
                    type:"function"
                })
            }
        )
         _(domain.entities).each(
                function(e){
                    graph.nodes.push( {
                        name:e.name,
                        type:"entity"
                    })
                }
            )
    return graph
}
