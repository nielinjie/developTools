 $.getJSON('./tests',function(data){
            window.data.testReport=data[0].results
        })
//ui is split from marker it self, so that you can build ui for multiply marker.
window.markerUIs.push(
    (function(){


        var a=$("<a class='list-group-item' href='#'/>")
                    var head=$("<h4 class='list-group-item-heading'/>").text("Testing")
                    a.append(head)

                    var text=$("<div class='list-group-item-text'/>")
                    var p=window.markerUIUtils.para("Functions that not pass test. ","darkRed")
                    window.markerUIUtils.buttons(p,function(){return new TestingNotPassMarker()})
                    text.append(p)
                    var p2=window.markerUIUtils.para("Functions that not run test. ","#eea236")
                    window.markerUIUtils.buttons(p2,function(){return new TestingNotRunMarker()})
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