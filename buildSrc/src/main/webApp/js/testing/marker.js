window.markers.push(
    new TestingNotPassMarker()
)
window.markers.push(
    new TestingNotRunMarker()
)

function  TestingNotPassMarker(){
    this.name="Testing-Not Passed"
    this.result=[]
    var this_=this
    $.getJSON('./tests',function(data){
            this_.result=data[0].results
        })
    this.fun=function(){
         return _(this_.result).chain().map(function(r){
            return (r.passed<r.run)?{
                name:r.name,
                css:{"background-color":"darkRed"},
                text:"Not Passed"
            }:0
         }).compact().value()
    }
    this.ui=function(){
        var a=$("<a class='list-group-item' href='#'/>").attr("data-name",this.name)
        var head=$("<h4 class='list-group-item-heading'/>").text(this.name+" ")
        head.append($("<span class='label'>_</span>").css({'background-color':'darkRed'}))
        a.append(head)
        var text=$("<div class='list-group-item-text'/>")
        text.append($("<p/>").text("A marker/selector to find all function that not pass test."))
        text.append($("<button class='btn btn-default btn-xs'/>").text("Mark").click(function(e){
                         e.stopPropagation();
                         var name=$(this).closest("a").attr("data-name")
                         var marker=_(window.markers).findWhere({name:name})
                         addMarker(marker)
                         //TODO ??auto call when addXXX?
                         applySearches()
                     })).append(" / ").append($("<button class='btn btn-default btn-xs'/>").text("Select").click(function(e){
                                    e.stopPropagation();
                                    var name=$(this).closest("a").attr("data-name")
                                    var marker=_(window.markers).findWhere({name:name})
                                    addMarker(marker)
                                    //TODO ??auto call when addXXX?
                                    applySearches()
                                }))
        a.append(text)

        return a
    }
    this.briefUI=function(){
        return {
            text: this_.name,
            color: 'darkRed'
        }
    }
}

function  TestingNotRunMarker(){
    this.result=[]
    this.name='Testing-Not Run'
    var this_=this
    $.getJSON('./tests',function(data){
            this_.result=data[0].results
        })
    this.fun=function(){
          return _(this_.result).chain().map(function(r){
                     return (r.run<r.total)?{
                         name:r.name,
                         css:{"background-color":"#eea236"},
                         text:"Not Run"
                     }:0
                  }).compact().value()
    }
    this.ui=function(){
            var a=$("<a class='list-group-item' href='#'/>").text(this.name+" ").attr("data-name",this.name)
            a.append($("<span class='label'>_</span>").css({'background-color':'#eea236'}))
            return a
        }
         this.briefUI=function(){
                return {
                    text: this_.name,
                    color: '#eea236'
                }
            }
}