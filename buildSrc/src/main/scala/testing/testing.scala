package com.paic.testing



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