function entities(){
    return _(window.domains).chain().pluck('entities').flatten().value()
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

function entityPackageName(entity){
    return _.chain(entity.name.names).tail().initial().join(".").value()
}
function memberKey(member,entity,inner){
    return key(entity)+"."+ (_.isUndefined(inner)?"":(inner.name+"."))+member.name
}

function methodData(method,entity,inner){
    return {
        key:memberKey(method,entity,inner),
        name:method.name
    }
}

function propertyData(property,entity,inner){
    return {
        key:memberKey(property,entity,inner),
        name:property.name
    }
}

function entityData(entity){
    return {
        key: key(entity),
        name: entityShortNameString(entity),
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
            key: memberKey(inner,entity),
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
             to: key(entity), from: memberKey(inner,entity), relationship: "aggregation"


        }
}
