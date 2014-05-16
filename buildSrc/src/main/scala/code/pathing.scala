package com.paic.code.pathing

import java.io.File
import com.paic.server.{JsonRestPlan, Repository}
import scala.io.{Codec, Source}
import org.json4s._
import org.json4s.native.Serialization

import org.json4s.Extraction._


import scala.collection.JavaConverters._

case class PathingList(feToP:List[PathingFunctionEntity]){
  def merge(b:PathingList)={
    PathingList((this.feToP ++ b.feToP).distinct)
  }
}
case class PathingFunctionEntity(pathingR:String,functionEntityName:String)

object PathingFunctionEntity{
  def apply(line:String):PathingFunctionEntity={
    val reg="([\u4e00-\u9fa5\\w/]+):\\s*([\\w\\*\\./]+)".r
    val reg(fe,pr)=line
    PathingFunctionEntity(pr,fe)
  }

}
object PathingList{
  def apply(file:File):PathingList={
    PathingList(Source.fromFile(file)(Codec("utf-8")).getLines().toList.map(PathingFunctionEntity(_)))
  }

}




class PathingListRepository(val sourceFiles: List[File]) extends Repository {
  def list:PathingList={
    sourceFiles.map{
      case f=>
        PathingList(f)
    }.reduceLeft(_.merge(_))
  }



  def query(query: Option[JObject]) = {
    implicit val formats = Serialization.formats(NoTypeHints)
    query match {
      case None => List(decompose(list).asInstanceOf[JObject])
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

class Plan(sourceFiles:List[File]) extends JsonRestPlan("pathing","pathings",new PathingListRepository(sourceFiles)){
  def this(sourceFiles:java.util.List[File])=this(sourceFiles.asScala.toList)
}