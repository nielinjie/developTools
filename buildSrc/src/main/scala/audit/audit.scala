package com.paic.developer.code
import scala.collection.JavaConverters._
object Audit {
  def forTouchedMethod(touched:List[Method],scores:Map[Method,Object]):java.util.Map[Method,Object]={
    scores.filter {
      case s=>
        touched.contains(s._1)
    } .asJava
  }
  def forTouchedMethod(touched:List[Method],scores:java.util.Map[Method,Object]):java.util.Map[Method,Object]={
    forTouchedMethod(touched,scores.asScala.toMap)
  }
}