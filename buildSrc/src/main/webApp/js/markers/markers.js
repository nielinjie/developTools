
//marker.fun - result (and its style) - [{name,css, text}]
//marker.briefUI - display in selector box - {text,color}
window.markerUIs=[]
//marker.ui - display in markers panel, to config and trigger marker

$(function(){
    $(".dropdown-menu.markers div.list-group").empty()
    _(window.markerUIs).each(function(m){
        $(".dropdown-menu.markers div.list-group").append(m)
    })

})

