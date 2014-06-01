$.getJSON('./pathings',function(data){
            window.data.pathings=data[0].feToP
        })
$.getJSON('./packages',function(data){
            window.data.packages=data[0].feToP
        })
$.getJSON('./sources',function(data){
    window.data.sources=data[0].sources
})
function wildcardToRegExp(w){
    //Todo support more
    return w.replace(/\*/g, "[^ ]*");
}
//ui is split from marker it self, so that you can build ui for multiply marker.

//1. com.paic.eoa - dotStyle
//2. com/paic/eoa - slashStyle
//FIXME. For now, it is only for jnccs report - com.eoa.package.Method(P1,P2)
function mapCodeToFunEn(dotStyle){
    var normalized=toSlashStyle(methodToType(dotStyle))
    var re=findByPackage(normalized)
    return _(re).chain().union(findByPathing(normalized)).compact().uniq().value()
}
function methodToType(dotStyle){
    return _(dotStyle.split(".")).initial().join(".")
}
function toDotStyle(slashStyle){
    return slashStyle.replace(new RegExp("/", "g"),".")
}
function toSlashStyle(dotStyle){
    return dotStyle.replace(/\./g,"/")
}

function findByPackage(slashStyle){
    return _(window.data.packages).find(function(package){
        var pathRegex = wildcardToRegExp(toDotStyle(package.packagesR))
        return slashStyle.match(pathRegex)
    })
}
function findByPathing(slashStyle){
    return _(window.data.pathings).find(function(pathI){
        var pathRegex = wildcardToRegExp(pathI.pathingR)
        return slashStyle.match(pathRegex)
    })
}
//End fix me


window.markerUIs.push(
    (function(){
            var a=$("<a class='list-group-item' href='#'/>")
            var head=$("<h4 class='list-group-item-heading'/>").text("Coding - Structure")
            a.append(head)

            var text=$("<div class='list-group-item-text'/>")
            var p=window.markerUIUtils.para("Function/Entities that have related code found. ","darkGreen")
            var fun=function(){return new HaveCodeMarker()}
            window.markerUIUtils.buttons2(p,{marker:fun,multiSelector:fun,multiFocus:fun})
            text.append(p)
            var p2=window.markerUIUtils.para("Function/Entities that have related package. ","green")
            var fun2=function(){return new HavePackageMarker()}
            window.markerUIUtils.buttons2(p2,{marker:fun2,multiSelector:fun2,multiFocus:fun2})
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
            var pathRegex = wildcardToRegExp(r.pathingR)
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
