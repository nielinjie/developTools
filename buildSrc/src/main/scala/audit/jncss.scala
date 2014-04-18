package com.paic.developer.measure

import java.io.File
import scala.xml.XML
import com.paic.developer.code.{Clazz, Method}



object JNcss {
  def report(file:File):Map[Method,Int]={
    (XML.loadFile(file) \\ "function") .map {
      case node =>
        Method((node \ "name").text) -> (node \"ccn").text.toInt
    } .toMap
  }

}