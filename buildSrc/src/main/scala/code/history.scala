package com.paic.code.history

import java.io.File
import com.paic.server.{JsonRestPlan, OneObjectRepository}

import scala.collection.JavaConverters._
import com.paic.developer.measure.JNcss
import com.paic.developer.code.Method
import com.paic.code.packages.{PackagesList, PackagesFunctionEntity}
import scala.io.{Codec, Source}

case class HistoryResult(result:List[History]){
  def merge(b:HistoryResult):HistoryResult={
    HistoryResult(this.result.++(b.result))
  }
}
case class History(path:String,action:String,date:String,user:String,version:String)

object History{
  def apply(line:String):History={
    val path::action::date::user::version::Nil=line.split("""\s""").toList
    History(path,action,date,user,version)
  }

}
object HistoryResult{
  def apply(file:File):HistoryResult={
    HistoryResult(Source.fromFile(file)(Codec("utf-8")).getLines().toList.map(History(_)))
  }

}

class HistoryRepository(val sourceFiles: List[File]) extends OneObjectRepository[HistoryResult] {
  override def obj: HistoryResult = {
    sourceFiles.map {
      case f =>
        HistoryResult(f)
    }.reduceLeft(_.merge(_))
  }
}



class Plan(sourceFiles: List[File]) extends JsonRestPlan("history","historys",new HistoryRepository(sourceFiles)){
  def this(sourceFiles:java.util.List[File])=this(sourceFiles.asScala.toList)
}