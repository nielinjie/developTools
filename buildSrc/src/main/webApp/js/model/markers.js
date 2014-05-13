window.markers=[]

$(function(){
    $(".dropdown-menu.markers").empty()
    _(window.markers).each(function(m){
        var li=$("<li/>")
        var a=$("<a href='#'/>").text(m.name+" ").attr("data-name",m.name)
        a.append($("<span class='label'>_</span>").css({'background-color':m.color}))
        li.append(a)
        $(".dropdown-menu.markers").append(li)
    })
    $(".dropdown-menu.markers li a").on("click",function(e){
        var name=$(this).attr("data-name")
        var marker=_(window.markers).findWhere({name:name})
            //TODO ??why dump?
            addMarker({
              name:marker.name,
              color:marker.color,
              marker:marker.marker
              })
            //TODO ??auto call when addXXX?
            applySearches()
    })
})

