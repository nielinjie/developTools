$.getJSON('./pathings',function(data){
            window.data.pathings=data[0].feToP
        })
$.getJSON('./packages',function(data){
            window.data.packages=data[0].feToP
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
            var p=window.markerUIUtils.para("Function/Entities that have related code found. ","darkGreen")
            window.markerUIUtils.buttons(p,HaveCodeMarker,"Have Code")
            text.append(p)
            var p2=window.markerUIUtils.para("Function/Entities that have related package. ","green")
            window.markerUIUtils.buttons(p2,HavePackageMarker,"Have Package")
            text.append(p2)
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
function  HavePackageMarker(){
    this.name="Have Package"
    this.result=window.data.packages
    var this_=this

    this.fun=function(){
         return _(this_.result).chain().map(function(r){
            return {
                name:r.functionEntityName,
                css:{"background-color":"green","fill":"green"},
                text:"Package"
            }
         }).compact().value()
    }

    this.briefUI=function(){
        return {
            text: this_.name,
            color: 'green'
        }
    }
}