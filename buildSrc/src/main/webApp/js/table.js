function fullTable(){
    var table = $(".nodes-table tbody")
    table.empty()
    _(window.domains).each(function(domain){
        _(domain.entities).each(function(entity){
        var tr = trForEntity(entity)
                table.append(tr)
        })
    })

    $(".nodes-table tbody tr").hover(
                                function() {
                                  $( this ).addClass( "hover" );
                                  //TODO effect on graph when table hover?
                                  //TODO and in turn.
//                                  $("g.node[data-name=\""+$(this).attr("data-name")+"\"]").addClass("hover")
                                }, function() {
                                  $( this ).removeClass( "hover" );
                                  //TODO effect on graph when table hover?
//                                  $("g.node[data-name=\""+$(this).attr("data-name")+"\"]").removeClass("hover")

                                }
                              );
}
function trForEntity(entity){
    var tr = $("<tr/>").addClass("displayed")
    var td = $("<td/>").text(entityFullName(entity)).appendTo(tr)
    $("<td/>").appendTo(tr)
    $("<td/>").appendTo(tr)
    return tr
}


