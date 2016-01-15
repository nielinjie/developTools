package domain.parse

import domain.dsl.FunctionFirstDSL
import domain.{Domain, Entity, Id, Ref,Function}
import org.kiama._
import org.kiama.rewriting.Rewriter._


import scala.collection.mutable.MutableList

/**
  * Created by nielinjie on 1/14/16.
  */
object Rewrite {
  def rewrite(domain:FunctionFirstDSL.Domain):Domain = {
    val functions:MutableList[Function]=MutableList()
    val refs:MutableList[Ref]=MutableList()
    val entities:MutableList[Entity]=MutableList()
    val funcFind= query( {
      case f@FunctionFirstDSL.Function(rs_,es,comments,name,alias) =>

        refs.++= (rs_.map {
          case r:_root_.domain.dsl.Ref =>
              Ref(Id(f.name),Id(r.to.name),r.typ)
        })
        refs.++= (es.map {
          case e:FunctionFirstDSL.Entity =>
            Ref(Id(f.name),Id(e.name),"use")
        })
        entities.++= ( es.map {
          case e:FunctionFirstDSL.Entity =>
            Entity(e.name,e.alias)
        })

        functions.+= (Function(f.name,f.comments,f.alias))
    } : FunctionFirstDSL.Function ==> Unit)

    val top=everywherebu(funcFind)
    top(domain).get
    Domain(functions.toList,entities.toList,refs.toList)
  }
}
