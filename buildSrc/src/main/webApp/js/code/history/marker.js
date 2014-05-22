$.getJSON('./historys',function(data){
            window.data.historys=data[0].result
        })

window.markerUIs.push(
    (function(){
            var a=$("<a class='list-group-item' href='#'/>")
            var head=$("<h4 class='list-group-item-heading'/>").text("Coding - History")
            a.append(head)
            var versions=2
            //todo support other marker cofing: author/date/frequent
            var text=$("<div class='list-group-item-text'/>")
            var p=window.markerUIUtils.para("Function/Entities that have related CCS Changed. ","#eea236")
            p.append("In versions: ").append($("<span class='form-inline form-inline'/>").append($("<select class='form-control form-inline input-sm'> \
                        <option value='1'>1</option> \
                        <option value='2' selected>2</option> \
                      </select>").click(function(e){
                        e.stopPropagation()
                      }).change(function(e){
                        versions=$(this).val()
                      })))

            window.markerUIUtils.buttons(p,function(){
                var marker = new ChangedMarker()
                marker.versions=versions
                return marker
            })
            text.append(p)

            a.append(text)
            return a})()
)

function mapPathToFunEn(path){
    var normalized=path.split(".")[0]
    var re=findByPackage(normalized)
    return _(re).chain().union(findByPathing(normalized)).uniq().value()
}

function  ChangedMarker(){
    this.name="Changed"
    this.result=window.data.historys
    this.versions = 2
    var this_=this
    var maxVersion=_(this.result).chain().pluck("version").max().value()
    this.fun=function(){
         return _(this_.result).chain().filter(function(h){
            return h.version >= maxVersion-this_.versions+1
         }).map(function(h){
            return mapPathToFunEn(h.path)
         }).flatten().compact().uniq().map(function(name){
            return {
                            name:name.functionEntityName,
                            css:{"background-color":"#eea236","fill":"#eea236"},
                            text:"Changed - "+this_.versions+" v"
                        }
         }).value()
    }
    this.briefUI=function(){
        return {
            text: this_.name+" - "+this_.versions+" v",
            color: '#eea236'
        }
    }
}