package domain

import java.io.File

import domain.parse._

import scala.io.Source

object Main2 {
  def main(arg:Array[String])={
    val printer=SimplePrinter
    val pre=Source.fromFile(new File("./lines.entities")).mkString
//    val pre=Preprocessor.preProcess(Source.fromFile(new File("./lines.entities")).mkString)
    println(pre)
    val parsed=LineParser.parseAll(LineParser.all,pre)
    println(parsed.map{
      d=>
        printer.print(d)
//        val re= Rewrite.rewrite(d).normalize
//        printer.print(re)
//        val json=Json.json(re)
//        val writer = new FileWriter(new File("./domain.js"))
//          writer.write(s"window.domain = ${json}")
//        writer.close
    })
  }
}