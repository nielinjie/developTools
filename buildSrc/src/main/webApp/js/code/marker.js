 $.getJSON('./packages',function(data){
            window.data.packages=data[0].feToP
        })
//ui is split from marker it self, so that you can build ui for multiply marker.

window.markerUIs.push(
    (function(){
            var a=$("<a class='list-group-item' href='#'/>")
            var head=$("<h4 class='list-group-item-heading'/>").text("Have Package")
            a.append(head)

            var text=$("<div class='list-group-item-text'/>")
            text.append($("<p/>").text("A marker/selector to find  function/entities that have (java-)package found. ").append($("<span class='label'>_</span>").css({'background-color':'darkGreen'})))

            .append($("<button class='btn btn-default btn-xs'><i class='fa fa-tags fa-fw'/></button>").click(function(e){
                e.stopPropagation();
                var marker=new HavePackageMarker()
                addMarker(marker)
                applySearches()
             })).append(" / ").append($("<button class='btn btn-default btn-xs'><i class='fa fa-hand-o-up fa-fw'/></button>").click(function(e){
                e.stopPropagation();
                var marker=new HavePackageMarker()
                addMultiSelect(_(marker.fun()).pluck("name"),"Have Package")
                applySearches()
            }))
            a.append(text)

            return a})()
)
function  HavePackageMarker(){
    this.name="Have Package"
    this.result=window.data.packages
    var this_=this

    this.fun=function(){
         return _(this_.result).chain().map(function(r){
            return {
                name:r.functionEntityName,
                css:{"background-color":"darkGreen","fill":"darkGreen"},
                text:"Package"
            }
         }).compact().value()
    }

    this.briefUI=function(){
        return {
            text: this_.name,
            color: 'darkGreen'
        }
    }
}
