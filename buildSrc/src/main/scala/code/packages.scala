package com.paic.code.packages

import java.io.File
import com.paic.server.{OneObjectRepository, JsonRestPlan, Repository}
import scala.io.{Codec, Source}


import org.json4s.Extraction._


import scala.collection.JavaConverters._

case class PackagesList(feToP:List[PackagesFunctionEntity]){
  def merge(b:PackagesList)={
    PackagesList((this.feToP ++ b.feToP).distinct)
  }
}
case class PackagesFunctionEntity(packagesR:String,functionEntityName:String)

object PackagesFunctionEntity{
  def apply(line:String):PackagesFunctionEntity={
    val reg="([\u4e00-\u9fa5\\w/]+):\\s*([\\w\\.]+)".r
    val reg(fe,pr)=line
    PackagesFunctionEntity(pr,fe)
  }

}
object PackagesList{
  def apply(file:File):PackagesList={
    PackagesList(Source.fromFile(file)(Codec("utf-8")).getLines().toList.map(PackagesFunctionEntity(_)))
  }

}




class PackagesListRepository(val sourceFiles: List[File]) extends OneObjectRepository[PackagesList] {
  override def obj:PackagesList={
    sourceFiles.map{
      case f=>
        PackagesList(f)
    }.reduceLeft(_.merge(_))
  }



}

class Plan(sourceFiles:List[File]) extends JsonRestPlan("package","packages",new PackagesListRepository(sourceFiles)){
  def this(sourceFiles:java.util.List[File])=this(sourceFiles.asScala.toList)
}