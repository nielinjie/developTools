package domain.dsl


import java.util.UUID

import domain.dsl.Message.{PropertyNameDuplicated, MethodNameDuplicated, EntityNameDuplicated}
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


  //FIXME some index should be domain/document scope.
  var domains: List[Domain] = List[Domain]()

  val positionIndex: Index[Product, Position] = index[Product, Position] //domain scope
  val messagesIndex = index[Product, List[Message.Message]] //domain scope
  val comments = index[Product,Comment] //domain scope

  val entityIndex: Index[Entity, QName] = index[Entity, QName] //global
  val nameIndex: Index[QName, Entity] = index[QName, Entity] //global

  def message(p: Product, s: Message.Message) = {
    messagesIndex.update(p, messagesIndex.getOrElse(p, Nil).:+(s))
  }

  def build() = {
    this.domains = this.domains.map(buildPositionIndex)
    this.domains = this.domains.map(EntityRewritor.rewriteEntityQName(_, this))
    this.domains = this.domains.map(checkDuplicatedEntityName)
    this.domains = this.domains.map(EntityRewritor.guessTypeFullName(_,this))
    this.domains = this.domains.map(EntityRewritor.rewriteInnerName)
    this.domains = this.domains.map(EntityRewritor.rewriteUnknownName)
  }

  def checkDuplicatedEntityName(d: Domain): Domain = {
    d.entities.foreach({
      e: Entity =>
        nameIndex.get(e.name) match {
          case Some(n) => {
            //Duplicated
            message(e, EntityNameDuplicated(e,n) )
          }
          case None => {
            nameIndex.put(e.name, e)
            entityIndex.put(e, e.name)
          }
        }
    })
    d
  }
  def checkDuplicatedMethodName(d:Domain):Domain ={
    d.entities.foreach({
      e:Entity =>
        val methodNames:mutable.Set[String] = new mutable.HashSet[String]()
        e.methods.foreach({
          m :Method =>
            if(methodNames.contains(m.name))
              message(m,MethodNameDuplicated(e,m))
              else {
              methodNames.+(m.name)
          ()}
        })
        val propertyNames:mutable.Set[String] = new mutable.HashSet[String]()
        e.properties.foreach({
          m :Property =>
            if(propertyNames.contains(m.name))
              message(m,PropertyNameDuplicated(e,m))
            else {
              propertyNames.+(m.name)
              ()}
        })
    })
    d
  }

  def buildPositionIndex(d: Domain): Domain = {
    val pi = EntityRewritor.positionIndex(d)
    positionIndex.putAll(pi)
    d
  }
}
