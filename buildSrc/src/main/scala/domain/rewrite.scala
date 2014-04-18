package com.paic.domain

import org.kiama.rewriting.Rewriter._
import org.kiama.output.PrettyPrinter
import org.kiama.rewriting.Strategy
import scala.collection.mutable.MutableList
import com.paic.domain
import org.slf4j.{Logger, LoggerFactory}


object Rewrite {
  def rewrite(domain:DSL.Domain):Graph.Domain = {
    val funcs:MutableList[Graph.Function]=MutableList()
    val refs:MutableList[Graph.Ref]=MutableList()
    val entities:MutableList[Graph.Entity]=MutableList()
    val funcFind= query {
      case f@DSL.Function(rs_,es,comments,name,alias) =>
        refs.++= (rs_.map {
          case r:DSL.Ref =>
              Graph.Ref(Graph.Id(f.name),Graph.Id(r.to.name),r.typ)
        })
        refs.++= (es.map {
          case e:DSL.Entity =>
            Graph.Ref(Graph.Id(f.name),Graph.Id(e.name),"use")
        })
        entities.++= ( es.map {
          case e:DSL.Entity =>
            Graph.Entity(e.name,e.alias)
        })
        funcs.+= (Graph.Function(f.name,f.comments,f.alias))
    }

    val top=everywherebu(funcFind)
    top(domain).get
    Graph.Domain(funcs.toList,entities.toList,refs.toList)
  }
}
object Printer extends PrettyPrinter{
  val log: Logger = LoggerFactory.getLogger(Printer.getClass)

  def print(any:Any) ={
    log.debug(super.pretty_any(any).toString)
  }
}