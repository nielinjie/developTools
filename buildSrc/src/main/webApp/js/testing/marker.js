window.markers.push(
    {name:"Testing-Not Passed",color:"darkRed",marker:new TestingNotPassMarker()}
)
window.markers.push(
    {name:"Testing-Not Run",color:"#eea236",marker:new TestingNotRunMarker()}
)

function  TestingNotPassMarker(){
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
}

function  TestingNotRunMarker(){
    this.result=[]
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
}