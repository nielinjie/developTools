function loadDomain(callback){
    $.getJSON("./domains",function(data){
        window.domains = data
          if(callback)
        callback()
    })
  
}
$(function(){
    loadDomain(function(data){
    fullTable()
    fullGraph()
    })
    
})