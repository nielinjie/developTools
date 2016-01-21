package domain.parse

import domain.dsl.EntitiesDSL._
import domain.dsl.Message.{GuessedFullName, GuessingFullName}
import domain.dsl.{Context, Position}
import org.kiama.rewriting.Rewriter._

import scala.collection.mutable


/**
  * Created by nielinjie on 1/18/16.
  */
object EntityRewritor {
  def guessTypeFullName(domain: Domain, context: Context): Domain = {
    def findLastEq(qn: QName, names: List[QName]) = {
      names.filter({
        n =>
          n.lastEq(qn)
      })
    }

    def me = rule[Product] {
      case m: Method =>
        everywheretd(typ(m))(m).get.asInstanceOf[Method]
      case p: Property =>
        everywheretd(typ(p))(p).get.asInstanceOf[Property]

    }

    def typ(m: Product) = rule[QName] {
      case q: QName if !q.isFull => {
        val possible: List[QName] = findLastEq(q, context.nameIndex.keys.toList)
        possible.foreach(p => context.message(m, GuessingFullName(m, q, context.nameIndex.getOrElse(p, ???))))
        if (possible.nonEmpty) {
          val qq = possible.head.copy()
          context.message(m, GuessedFullName(m, q, context.nameIndex.getOrElse(qq, ???)))
          qq
        } else {
          q
        }
      }
    }
    everywheretd(me)(domain).get.asInstanceOf[Domain]
  }

  def entityNameIndex(domain: Domain): Map[Entity, QName] = {
    val re = domain.entities.map {
      e =>
        (e, e.name)
    }.toMap
    //TODO check for duplicated names
    re
  }

  def positionIndex(domain: Domain): Map[Product, Position] = {
    val map = mutable.Map.empty[Product, Position]
    def m = query[Any]({
      case m: Method => map.put(m, Position(m.pos, domain.document))
      case p: Property => map.put(p, Position(p.pos, domain.document))
      case i: Inner => map.put(i, Position(i.pos, domain.document))
      case e: Entity => map.put(e, Position(e.pos, domain.document))
    })

    everywherebu(m)(domain)
      .get.asInstanceOf[Domain]
    map.toMap
  }

  def rewriteEntityQName(domain: Domain, context: Context): Domain = {
    def e = rule[Entity] {
      case e: Entity =>
        if (e.name.isFull) e
        else
          e.copy(name = e.name.full(context.positionIndex.getOrElse(e, ???).doc.getPackage))
    }
    val doc = everywherebu(e)(domain)
      .get.asInstanceOf[Domain]
    doc
  }

  def rewriteInnerName(domain:Domain): Domain = {
    var index:Int =0
    def noName = rule[Inner]{
      case i:Inner if i.name.equals(unknown) => {
        val inner = i.copy(name = s"_$index")
        index = index+1
        inner
      }
    }
    everywherebu(noName)(domain)
      .get.asInstanceOf[Domain]
  }

  def rewriteUnknownName(domain:Domain):Domain={
    def u = rule[Property]{
      case p:Property if p.name.equals(unknown) =>{
        p.copy(name =p.typ.fold(
          {qn:QName=>qn.names.last},{in:Inner=>in.name}
        ))
      }

    }
    everywherebu(u)(domain)
      .get.asInstanceOf[Domain]
  }
}
