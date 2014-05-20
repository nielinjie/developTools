package com.paic.code.pathing

import java.io.File
import com.paic.server.{OneObjectRepository, JsonRestPlan, Repository}
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




class PathingListRepository(val sourceFiles: List[File]) extends OneObjectRepository[PathingList] {
  override def obj:PathingList={
    sourceFiles.map{
      case f=>
        PathingList(f)
    }.reduceLeft(_.merge(_))
  }



}

class Plan(sourceFiles:List[File]) extends JsonRestPlan("pathing","pathings",new PathingListRepository(sourceFiles)){
  def this(sourceFiles:java.util.List[File])=this(sourceFiles.asScala.toList)
}