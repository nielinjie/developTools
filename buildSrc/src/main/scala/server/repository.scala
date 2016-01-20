package com.paic.server

import org.json4s._
import JsonDSL._
import java.util.UUID
import org.json4s.native.Serialization
import org.json4s.Extraction._

trait Repository {
  def add(obj:JObject):UUID
  def query(query:Option[JObject]):List[JObject]
  def clear():Unit
}

trait OneObjectRepository[T]  extends Repository {
  def obj:T

  def query(query: Option[JObject]) = {
    implicit val formats = Serialization.formats(NoTypeHints)
    query match {
      case None => List(decompose(obj).asInstanceOf[JObject])
      case _ => ???
    }
  }

  def add(obj: JObject) = {
    ???
  }

  def clear = {
    ???
  }
}

class MapRepository extends Repository{
  private val repository: scala.collection.mutable.Map[UUID, JObject] = scala.collection.mutable.Map.empty
  def add(obj:JObject)={
    def uuid = java.util.UUID.randomUUID
    repository.put(uuid,obj ~ ("id"->uuid.toString))
    uuid
  }
  def query(query:Option[JObject]) ={
    query match {
      case None => repository.values.toList
      case _ => repository.toList.head._2::Nil
    }
  }
  def clear = {
    repository.clear()
  }
}