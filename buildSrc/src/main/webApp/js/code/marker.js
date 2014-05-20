$.getJSON('./pathings',function(data){
            window.data.pathings=data[0].feToP
        })

$.getJSON('./sources',function(data){
    window.data.sources=data[0].sources
})
//ui is split from marker it self, so that you can build ui for multiply marker.

window.markerUIs.push(
    (function(){
            var a=$("<a class='list-group-item' href='#'/>")
            var head=$("<h4 class='list-group-item-heading'/>").text("Coding")
            a.append(head)

            var text=$("<div class='list-group-item-text'/>")
            var p=$("<p/>")
            .append($("<i class='fa  fa-square fa-fw'/>").css({'color':'darkGreen'}))
            .append("To find Function/Entities that have related code found. ")

            p.append($("<button class='btn btn-default btn-xs'><i class='fa fa-tags fa-fw'/></button>").click(function(e){
                e.stopPropagation()
                var marker=new HaveCodeMarker()
                addMarker(marker)
                applySearches()
             })).append($("<button class='btn btn-default btn-xs'><i class='fa fa-hand-o-up fa-fw'/></button>").click(function(e){
                e.stopPropagation()
                var marker=new HaveCodeMarker()
                addMultiSelect(_(marker.fun()).pluck("name"),"Have Code")
                applySearches()
            }))

            text.append(p)

            a.append(text)

            return a})()
)
function  HaveCodeMarker(){
    this.name="Have Code"
    this.result=window.data.pathings
    var this_=this

    this.fun=function(){
         return _(this_.result).chain().filter(function(r){
            var pathRegex = r.pathingR.replace(/\*/g, "[^ ]*");
            return    _(window.data.sources).any(function(sourcePath){
                return sourcePath.match(pathRegex)
            })
         }).map(function(r){
            return {
                name:r.functionEntityName,
                css:{"background-color":"darkGreen","fill":"darkGreen"},
                text:"Code"
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
