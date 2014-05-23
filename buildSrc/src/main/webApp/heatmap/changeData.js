$.when($.getJSON("../historys"),$.getJSON('../audits')).done(function(r1,r2){
    window.origindata=changeData(r1[0][0].result,r2[0][0].result.jncss)
    window.minDate = (dateFormat = d3.time.format('%Y-%m-%d'), _.chain(window.origindata).map(function(it){
        return it.logs;
      }).flatten().map(function(it){
        return dateFormat.parse(it.date);
      }).min().value());
    window.begin()

})


changeData =function(history,complex){
//    [
//      {
//      "method":"com.paic.eoa.core.bo.CachetDesc.setCachetPrint(String)",
//      "score":1
//      },
//      {
//      "method":"com.paic.eoa.business.taskcategory.service.strategygroup.impl.StrategyGroupImpl.getImportStrategy()",
//      "score":1
//      },
    var methodToType = function(dotStyle){
        return _(dotStyle.split("(")[0].split(".")).initial().join("/")
    }
    var sum = function(list){
        return _.reduce(list, function(memo, num){ return memo + num; }, 0)
    }
    var complexByType = _(complex).chain().map(function(me){
        return {
            type:methodToType(me.method),
            score:me.score
        }
    }).groupBy("type").map(function(v,k){
        return {
            type:k,
            score:sum(_(v).pluck('score'))
        }
    }).value()
//    [
//    {
//    "path":"com/paic/eoa/core/TaskCategory.java",
//    "action":"M",
//    "date":"2014-5-22",
//    "user":"nielinjie001",
//    "version":"81"
//    },
    var historyLogByType = _(history).chain().map(function(h){
        return _(h).extend({
            type:h.path.split(".")[0]
        })
    }).value()
    return _(complexByType).map(function(com){
        var logs= _(historyLogByType).chain().filter(function(h){
                                  return h.type==com.type
                              }).map(function(hi){
                                  return _(hi).extend({
                                      author:hi.user
                                  })
                              }).value()
        return _(com).extend({
            logs: logs,
            touch: logs.length,
            complexity: com.score,
            path:com.type
        })
    })
}