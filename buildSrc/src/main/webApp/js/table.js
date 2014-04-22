
function updateTable(graph){
    $(".nodes-table tbody").empty()
    _(graph.nodes).each(function(n){
        var tr=$("<tr/>").attr("data-name",n.name)
        tr.append($("<td>").text(n.name))
        var td=$("<td>").append($("<span>").addClass("label").addClass("label-"+n.type).text(n.type =="function"?"F":"E"))
        tr.append(td)
        var td2=$("<td>").append($("<button type='button' class='btn btn-default btn-xs'>Focus</button>").attr("data-name",n.name))
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
        $(this).toggleClass( "selected" )
        selectedUpdate()
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
function filterTable(domain, filterFun){
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
     var filtered=filterFun?filterFun(graph):graph

      updateTable(filtered)
}

function reorderTable(campFun) {
    var tb=$(".nodes-table tbody")
    var trs=tb.children("tr").detach().sort(function(la,lb){
        return campFun($(la).attr("data-name"),$(lb).attr("data-name"))
    })
    tb.append(trs)
}

