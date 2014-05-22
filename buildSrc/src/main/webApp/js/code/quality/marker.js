$.getJSON('./audits',function(data){
            window.data.audits=data[0].result
        })

window.markerUIs.push(
    (function(){
            var a=$("<a class='list-group-item' href='#'/>")
            var head=$("<h4 class='list-group-item-heading'/>").text("Coding - Quality")
            a.append(head)

            var text=$("<div class='list-group-item-text'/>")
            var p=window.markerUIUtils.para("Function/Entities that have related CCS Issue. ","darkRed")
            window.markerUIUtils.buttons(p,function(){return new HaveCCSIssueMarker()},"CCS Issue")
            text.append(p)

            a.append(text)
            return a})()
)

function  HaveCCSIssueMarker(){
    this.name="CCS Issue"
    this.result=window.data.audits.jncss
    this.line = 5
    var this_=this

    this.fun=function(){
         return _(this_.result).chain().filter(function(j){
            return j.score >= this_.line
         }).map(function(j){
            return mapCodeToFunEn(j.method)
         }).flatten().compact().uniq().map(function(name){
            return {
                            name:name.functionEntityName,
                            css:{"background-color":"darkRed","fill":"darkRed"},
                            text:"CCS - "+ this_.line
                        }
         }).value()
    }
    this.briefUI=function(){
        return {
            text: this_.name+" - "+this_.line,
            color: 'darkRed'
        }
    }
}