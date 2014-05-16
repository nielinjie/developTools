 $.getJSON('./tests',function(data){
            window.data.testReport=data[0].results
        })
//ui is split from marker it self, so that you can build ui for multiply marker.
window.markerUIs.push(
    (function(){
            var a=$("<a class='list-group-item' href='#'/>").attr("data-name","Testing-Not Passed")
            var head=$("<h4 class='list-group-item-heading'/>").text("Testing")
            head
            a.append(head)
            var text=$("<div class='list-group-item-text'/>")
            var p=$("<p/>")
            .append($("<i class='fa  fa-square fa-fw'/>").css({'color':'darkRed'}))
            .append("To find all Functions that not pass test. ")
            p.append($("<button class='btn btn-default btn-xs'><i class='fa fa-tags fa-fw'/></button>").click(function(e){
                             e.stopPropagation();
                             var marker=new TestingNotPassMarker()
                             addMarker(marker)
                             applySearches()
                         })).append($("<button class='btn btn-default btn-xs'><i class='fa fa-hand-o-up fa-fw'/></button>").click(function(e){
                            e.stopPropagation();
                            var name=$(this).closest("a").attr("data-name")
                            var marker=new TestingNotPassMarker()
                            addMultiSelect(_(marker.fun()).pluck("name"),"Testing-Not Passed")
                            applySearches()
                        }))
            text.append(p)

            var p2=$("<p/>")
            .append($("<i class='fa  fa-square fa-fw'/>").css({'color':'#eea236'}))
            .append("To find all Functions that not run test. ")
            p2.append($("<button class='btn btn-default btn-xs'><i class='fa fa-tags fa-fw'/></button>").click(function(e){
                         e.stopPropagation();
                         var marker=new TestingNotRunMarker()
                         addMarker(marker)
                         applySearches()
                     })).append($("<button class='btn btn-default btn-xs'><i class='fa fa-hand-o-up fa-fw'/></button>").click(function(e){
                        e.stopPropagation();
                        var name=$(this).closest("a").attr("data-name")
                        var marker=new TestingNotRunMarker()
                        addMultiSelect(_(marker.fun()).pluck("name"),"Testing-Not Run")
                        //TODO ??auto call when addXXX?
                        applySearches()
                    }))
            text.append(p2)
            a.append(text)

            return a})()
)

function  TestingNotPassMarker(){
    this.name="Testing-Not Passed"
    this.result=window.data.testReport
    var this_=this

    this.fun=function(){
         return _(this_.result).chain().map(function(r){
            return (r.passed<r.run)?{
                name:r.name,
                css:{"background-color":"darkRed","fill":"darkRed"},
                text:"Not Passed"
            }:0
         }).compact().value()
    }

    this.briefUI=function(){
        return {
            text: this_.name,
            color: 'darkRed'
        }
    }
}

function  TestingNotRunMarker(){
    this.result=window.data.testReport
    this.name='Testing-Not Run'
    var this_=this

    this.fun=function(){
          return _(this_.result).chain().map(function(r){
                     return (r.run<r.total)?{
                         name:r.name,
                         css:{"background-color":"#eea236","fill":"#eea236"},
                         text:"Not Run"
                     }:0
                  }).compact().value()
    }

         this.briefUI=function(){
                return {
                    text: this_.name,
                    color: '#eea236'
                }
            }
}