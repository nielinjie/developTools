function entities(){
    return _(window.domains).chain().pluck('entities').flatten().value()
}

function packages(){
    return _(entities()).chain().map(function(e){
        return {
            name:entityPackage(e),
            parent:entityPackageParent(e)
            }
        }).unique(function(p){return p.name}).value()
}

function key(entity) {
    return entity.name.names.join(".")

}
function entityFullName(entity){
    return _(entity.name.names).tail().join(".")
}

function entityShortNameString(entity){
    return _(entity.name.names).last()
}
function entityPackageParent(entity){
    return _.chain(entity.name.names).initial().initial().join(".").value()
}
function entityPackage(entity){
    return _.chain(entity.name.names).initial().join(".").value()
}
function entityPackageName(entity){
    return _.chain(entity.name.names).tail().initial().join(".").value()
}
function memberKey(member,entity,inner){
    return key(entity)+"."+ (_.isUndefined(inner)?"":(inner.name+"."))+member.name
}

function methodData(method,entity,inner){
    return {
        key:"member - "+memberKey(method,entity,inner),
        name:method.name
    }
}

function propertyData(property,entity,inner){
    return {
        key:"member - "+memberKey(property,entity,inner),
        name:property.name
    }
}

function packageData(p){
    return {
        key: "package - "+p.name,
        parent: "package - "+p.parent
    }
}

function entityData(entity){
    return {
        key: "entity - "+key(entity),
        name: entityShortNameString(entity),
        parent:"package - "+entityPackage(entity),
        fullName:entityFullName(entity),
        packageName:entityPackageName(entity),
        methods:_(entity.methods).map(function(m){
            return methodData(m,entity)
        }),
        properties:_(entity.properties).map(function(p){
                               return propertyData(p,entity)
                           })

    }

}
//TODO nested Inner
function inners(entity){
   return  _(entity.properties).chain().pluck('typ').filter(function(ty){
        return _.isUndefined( ty.names)
    }).value()
}
function innerData(inner,entity){
    return {
            key: "member - "+memberKey(inner,entity),
            name: inner.name,
            methods:_(inner.methods).map(function(m){
                return methodData(m,entity,inner)
            }),
            properties:_(inner.properties).map(function(p){
                                   return propertyData(p,entity,inner)
                               })

        }
}
function innerLink(inner,entity){
    return {
             from: "entity - "+ key(entity), to: "member - "+memberKey(inner,entity), relationship: "aggregation"


        }
}

function typName(typ){
    return typ.names.join(".")
}

function refLink(entity,member){
    return {
        from: "entity - "+key(entity),
        to:"entity - "+ typName(member.typ),
        relationship:"ref"
    }
}
