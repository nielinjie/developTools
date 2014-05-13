window.markers=[]
//Example -
//window.markers.push(
//      {name:"Testing-Not Passed",marker:new TestingNotPassMarker()}
//  )
//marker.name
//marker.fun - result (and its style) - [{name,css, text}]
//marker.ui - display in markers panel, to config and trigger marker
//marker.briefUI - display in selector box - {text,color}


$(function(){
    $(".dropdown-menu.markers").empty()
    _(window.markers).each(function(m){
        var li=$("<li/>")
        li.append(m.ui())
        $(".dropdown-menu.markers").append(li)
    })
    $(".dropdown-menu.markers li a").on("click",function(e){
        var name=$(this).attr("data-name")
        var marker=_(window.markers).findWhere({name:name})
            addMarker(marker)
            //TODO ??auto call when addXXX?
            applySearches()
    })
})

