package com.paic.code.packaging

import java.io.File
import com.paic.server.{JsonRestPlan, Repository}
import scala.io.{Codec, Source}
import org.json4s._
import org.json4s.native.Serialization

import org.json4s.Extraction._


import scala.collection.JavaConverters._

case class PackageList(feToP:List[PackageFunctionEntity]){
  def merge(b:PackageList)={
    PackageList((this.feToP ++ b.feToP).distinct)
  }
}
case class PackageFunctionEntity(packageR:String,functionEntityName:String)

object PackageFunctionEntity{
  def apply(line:String):PackageFunctionEntity={
    val reg="([\u4e00-\u9fa5\\w/]+):\\s*([\\w\\*\\./]+)".r
    val reg(fe,pr)=line
    PackageFunctionEntity(pr,fe)
  }

}
object PackageList{
  def apply(file:File):PackageList={
    PackageList(Source.fromFile(file)(Codec("utf-8")).getLines().toList.map(PackageFunctionEntity(_)))
  }

}




class PackageListRepository(val sourceFiles: List[File]) extends Repository {
  def list:PackageList={
    sourceFiles.map{
      case f=>
        PackageList(f)
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

class Plan(sourceFiles:List[File]) extends JsonRestPlan("package","packages",new PackageListRepository(sourceFiles)){
  def this(sourceFiles:java.util.List[File])=this(sourceFiles.asScala.toList)
}