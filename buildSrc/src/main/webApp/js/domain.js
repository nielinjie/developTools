function findRelated(name){
    var domain=window.domain
    var ent=_(domain.entities).find(function(e){return e.name==name})
    if(ent){
        return findNeighbor1(domain,ent.name)
    }
    var fun=_(domain.functions).find(function(f){return f.name==name})
    if(fun){
        var re
        var n1=findNeighbor1(domain,fun.name)
        re = n1
        //if any entity in n1, add its n1
        return _(n1).chain().map(function(eorfName){
            return _(domain.entities).chain().filter(function(e){
                return e.name==eorfName
            }).map(function(e){
                return findNeighbor1(domain,e.name)
            }).flatten().value()
        }).flatten().uniq().union(re).value()
    }
    //not entity nor function
    return []
}
function findNeighbor1(domain,name){
    var refs=domain.refs.filter(function(r){
       return r.to.name==name || r.from.name==name
    })
    return _(refs).chain().map(function(r){
       return [r.to.name,r.from.name]
    }).flatten().uniq().without(name).value()
}