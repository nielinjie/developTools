package domain.dsl


import domain.dsl.Message.NameDuplicated
import domain.parse.EntityRewritor

import scala.collection.mutable
import domain.dsl.EntitiesDSL._

import scala.collection.JavaConversions._

/**
  * Created by nielinjie on 1/19/16.
  */
class Context {
  type Index[T, U] = mutable.Map[T, U]

  def index[T, U]: mutable.Map[T, U] = mutable.Map.empty[T, U]

  var domains: List[Domain] = List[Domain]()
  val positionIndex: Index[Product, Position] = index[Product, Position]
  val entityIndex: Index[Entity, QName] = index[Entity, QName]
  val nameIndex: Index[QName, Entity] = index[QName, Entity]
  val messagesIndex = index[Product, List[Message.Message]]

  def message(p: Product, s: Message.Message) = {
    messagesIndex.update(p, messagesIndex.getOrElse(p, Nil).:+(s))
  }

  def build() = {
    this.domains = this.domains.map(buildPositionIndex)
    this.domains = this.domains.map(EntityRewritor.rewriteEntityQName(_, this))
    this.domains = this.domains.map(checkDuplicatedEntityName)
    this.domains = this.domains.map(EntityRewritor.guessTypeFullName(_,this))
  }

  def checkDuplicatedEntityName(d: Domain): Domain = {
    d.entities.foreach({
      e: Entity =>
        nameIndex.get(e.name) match {
          case Some(n) => {
            //Duplicated
            message(e, NameDuplicated(e,n) )
          }
          case None => {
            nameIndex.put(e.name, e)
            entityIndex.put(e, e.name)
          }
        }
    })
    d
  }

  def buildPositionIndex(d: Domain): Domain = {
    val pi = EntityRewritor.positionIndex(d)
    positionIndex.putAll(pi)
    d
  }
}
