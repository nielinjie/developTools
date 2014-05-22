package com.paic.code.audit

import java.io.File
import com.paic.server.{JsonRestPlan, OneObjectRepository}

import scala.collection.JavaConverters._
import com.paic.developer.measure.JNcss
import com.paic.developer.code.Method

case class AuditResult(result:Map[String,AnyRef]){
  def merge(b:AuditResult):AuditResult={
    AuditResult(this.result.++(b.result))
  }
}
case class MethodScore(method:String,score:Int)
object AuditResult {
  def apply(name: String, fs: List[File]): AuditResult = {
    name match {
      case "jncss" =>
        AuditResult(Map(name -> fs.map {
          case f =>
            JNcss.report(f).map{
              case (method,int) =>
                MethodScore(method.clazz.name+"."+method.name,int)
            }
        }.reduceLeft(_.++(_))))
      //TODO other audit reports
    }
  }

  def apply(name: String, fs: java.util.List[File]): AuditResult = {
    AuditResult(name, fs.asScala.toList)
  }
}
class AuditRepository(val sourceFiles: Map[String,java.util.List[File]]) extends OneObjectRepository[AuditResult] {
  override def obj: AuditResult = {
    sourceFiles.map {
      case (name, f) =>
        AuditResult(name, f)
    }.reduceLeft(_.merge(_))
  }
}



class Plan(sourceFiles: Map[String,java.util.List[File]]) extends JsonRestPlan("audit","audits",new AuditRepository(sourceFiles)){
  def this(sourceFiles:java.util.Map[String,java.util.List[File]])=this(sourceFiles.asScala.toMap)
}