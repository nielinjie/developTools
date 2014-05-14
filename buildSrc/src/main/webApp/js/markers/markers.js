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
    $(".dropdown-menu.markers div.list-group").empty()
    _(window.markers).each(function(m){
        $(".dropdown-menu.markers div.list-group").append(m.ui())
    })

})

