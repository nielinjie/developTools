package domain

import org.kiama.==>
import org.kiama.rewriting.Rewriter._
import org.kiama.output.PrettyPrinter
import scala.collection.mutable.MutableList
import org.slf4j.{Logger, LoggerFactory}
import domain.dsl.{FunctionFirstDSL}


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
object Printer extends PrettyPrinter{
  val log: Logger = LoggerFactory.getLogger(Printer.getClass)

  def print(any:Any) ={
    log.debug(super.pretty_any(any).toString)
  }
}
object SimplePrinter extends PrettyPrinter{
  def print(any:Any)={
    println(super.pretty_any(any).toString)
  }
}
