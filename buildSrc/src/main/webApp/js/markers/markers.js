
//marker.fun - result (and its style) - [{name,css, text}]
//marker.briefUI - display in selector box - {text,color}
window.markerUIs=[]
//marker.ui - display in markers panel, to config and trigger marker

window.markerUIUtils={
    buttons:function(para,theMarkerFun){
        para.append($("<button class='btn btn-default btn-xs'><i class='fa fa-tags fa-fw'/></button>").click(function(e){
                        e.stopPropagation()
                        var marker=theMarkerFun()
                        addMarker(marker)
                        applySearches()
                     })).append($("<button class='btn btn-default btn-xs'><i class='fa fa-hand-o-up fa-fw'/></button>").click(function(e){
                        e.stopPropagation()
                        var marker=theMarkerFun()
                        addMultiSelect(_(marker.fun()).pluck("name"),marker.briefUI().text)
                        applySearches()
                    }))
    },
    buttons2:function(para,markFuns){
      //markFuns:
      //{
      //type: marker,multiSelector,bubbler,multiFocus
      //fun: marker/bubble class function
      //}
      var types=['marker','multiSelector','bubbler','multiFocus']
      var icons=_(types).object(['fa-tags','fa-hand-o-up','fa-circle-o','fa-crosshairs'])
      var funs=_(types).object([addMarker,addMultiSelect,addBubble,addMultiFocus])
      var more=_(types).object([false,true,false,true])
      var markerA=_(types).object([true,false,true,false])
      _(markFuns).each(function(fun,type){
        var i=$("<i class='fa fa-fw'/>")
        i.addClass(icons[type])
        para.append($("<button class='btn btn-default btn-xs'></button>").append(i).click(function(e){
                        e.stopPropagation()
                        var marker=fun(type)
                        if(more[type]){
                          funs[type](markerA[type]?marker:_(marker.fun()).pluck("name"),marker.briefUI().text)
                        }else{
                          funs[type](markerA[type]?marker:_(marker.fun()).pluck("name"))
                        }
                        applySearches()
                     }))
      })

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
