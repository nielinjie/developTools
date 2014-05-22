$.getJSON('./audits',function(data){
            window.data.audits=data[0].result
        })

window.markerUIs.push(
    (function(){
            var a=$("<a class='list-group-item' href='#'/>")
            var head=$("<h4 class='list-group-item-heading'/>").text("Coding - Quality")
            a.append(head)
            var chosen=0.9
            var text=$("<div class='list-group-item-text'/>")
            var p=window.markerUIUtils.para("Function/Entities that have related CCS Issue. ","darkRed")
            p.append($("<span class='form-inline form-inline'/>").append($("<select class='form-control form-inline input-sm'> \
                        <option value='5'>5</option> \
                        <option value='20'>20</option> \
                        <option value='50'>50</option> \
                        <option value='0.5'>50%</option> \
                        <option value='0.9' selected>90%</option> \
                      </select>").click(function(e){
                        e.stopPropagation()
                      }).change(function(e){
                        chosen=$(this).val()
                      })))

            window.markerUIUtils.buttons(p,function(){
                var marker = new HaveCCSIssueMarker()
                marker.line=chosen
                return marker
            })
            text.append(p)

            a.append(text)
            return a})()
)

function  HaveCCSIssueMarker(){
    this.name="CCS Issue"
    this.result=window.data.audits.jncss
    this.line = 0.9
    var this_=this
    var max=_(this.result).chain().pluck("score").max().value()
    this.fun=function(){
         return _(this_.result).chain().filter(function(j){
            return j.score >= (this_.line >=1 ? this_.line : this_.line* max) //todo this not really 分位数
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