package domain.dsl


import java.util.UUID

import domain.dsl.Message.{PropertyNameDuplicated, MethodNameDuplicated, EntityNameDuplicated}
import domain.parse.EntityRewritor
import org.rogach.scallop.ArgType.V

import scala.collection.mutable
import domain.dsl.EntitiesDSL._

import scala.collection.JavaConversions._

/**
  * Created by nielinjie on 1/19/16.
  */
class Context {
  type Index[K, V] = mutable.Map[K, V]

//  type DocumentScopeIndex[K,V]= mutable.Map[(Document,K),V]

  def index[K, V]: mutable.Map[K, V] = mutable.Map.empty[K, V]
//  def documentScopeIndex[K,V] =mutable.Map.empty[(Document,K), V]

  var domains: List[Domain] = List[Domain]()

  val productToPosition: Index[Product, Position] = index[Product, Position] //domain scope
  val positions:Index[Position,Product] = index[Position,Product]
  val messages = index[Position, List[Message.Message]] //domain scope
  val comments = index[Position,Comment] //domain scope

  val entityIndex: Index[Entity, QName] = index[Entity, QName] //global
  val nameIndex: Index[QName, Entity] = index[QName, Entity] //global


  def at[T<:Product](p:Position):T ={
    this.positions.getOrElse(p,???).asInstanceOf[T]
  }
  def message(p: Position, s: Message.Message) = {
    messages.update(p, messages.getOrElse(p, Nil).:+(s))
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
            message(d.position(e), EntityNameDuplicated(e,n) )
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
              message(d.position(m),MethodNameDuplicated(e,m))
              else {
              methodNames.+(m.name)
          ()}
        })
        val propertyNames:mutable.Set[String] = new mutable.HashSet[String]()
        e.properties.foreach({
          m :Property =>
            if(propertyNames.contains(m.name))
              message(d.position(m),PropertyNameDuplicated(e,m))
            else {
              propertyNames.+(m.name)
              ()}
        })
    })
    d
  }

  def buildPositionIndex(d: Domain): Domain = {
    val pi = EntityRewritor.positionIndex(d)
    productToPosition.putAll(pi)
    pi.foreach({
      case (k,v)=>
        positions.+=((v,k))
    })
    d
  }
}
