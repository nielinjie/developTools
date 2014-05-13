$(function(){
    reloadDiff()
})
function update(diff){
    _(diff.methods).each(function(m){
        var tr=$("<tr/>")
        tr.append($("<td/>").text(m.clazz.name))
        tr.append($("<td/>").text(m.name))
        $(".diff-table tbody").append(tr)
    })
}
function reloadDiff(){
     $.getJSON('./diffs',function(data){
            window.diff=data[0]
            update(window.diff)
        })
}