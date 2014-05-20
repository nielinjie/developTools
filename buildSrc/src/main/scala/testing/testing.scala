package com.paic.testing

import java.io.File
import com.paic.server.{OneObjectRepository, Repository, JsonRestPlan}
import scala.io.{Codec, Source}
import scala.collection.JavaConverters._


case class Report(results:List[TestResult]){
  def merge(b:Report)={
    Report(this.results++b.results)
  }
}
object Report {
  def fromString(lines:List[String]):Report={
    Report(lines.map(TestResult(_)))
  }
}
case class TestResult(name:String,total:Int,run:Int,passed:Int)
object TestResult{
  def apply(line:String):TestResult={
    val reg="([\u4e00-\u9fa5\\w/]+):\\s*(\\d+)/(\\d+)/(\\d+)".r
    val reg(name,total,run,passed)=line
    TestResult(name,total.toInt,run.toInt,passed.toInt)
  }
}

class TestingRepository(val sourceFiles: List[File]) extends OneObjectRepository[Report] {
  override def obj: Report = {
    sourceFiles.map {
      case f =>
        Report.fromString(Source.fromFile(f)(Codec("utf-8")).getLines().toList)
    }.reduceLeft(_.merge(_))
  }

}

class Plan(sourceFiles:List[File]) extends JsonRestPlan("test","tests",new TestingRepository(sourceFiles)){
  def this(sourceFiles:java.util.List[File])=this(sourceFiles.asScala.toList)
}