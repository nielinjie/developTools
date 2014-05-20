
//marker.fun - result (and its style) - [{name,css, text}]
//marker.briefUI - display in selector box - {text,color}
window.markerUIs=[]
//marker.ui - display in markers panel, to config and trigger marker

window.markerUIUtils={
    buttons:function(para,theMarker,selectText){
        para.append($("<button class='btn btn-default btn-xs'><i class='fa fa-tags fa-fw'/></button>").click(function(e){
                        e.stopPropagation()
                        var marker=new theMarker()
                        addMarker(marker)
                        applySearches()
                     })).append($("<button class='btn btn-default btn-xs'><i class='fa fa-hand-o-up fa-fw'/></button>").click(function(e){
                        e.stopPropagation()
                        var marker=new theMarker()
                        addMultiSelect(_(marker.fun()).pluck("name"),selectText)
                        applySearches()
                    }))
    },
    para:function(text,color){
        return $("<p/>")
                           .append($("<i class='fa  fa-square fa-fw'/>").css({'color':color}))
                           .append(text)
    }
}

$(function(){
    $(".dropdown-menu.markers div.list-group").empty()
    _(window.markerUIs).each(function(m){
        $(".dropdown-menu.markers div.list-group").append(m)
    })

})

