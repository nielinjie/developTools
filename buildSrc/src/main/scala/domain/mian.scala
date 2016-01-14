package domain

import java.io.{FileWriter, File, FileReader}
import domain.dsl.EntityParser
import domain.parse.Parser

import scala.io.Source
import scala.util.parsing.combinator._

object Main {
  def main(arg:Array[String])={
    val printer=SimplePrinter
    val pre=Preprocessor.preProcess(Source.fromFile(new File("./d.entities")).mkString)
    println(pre)
    val parsed=EntityParser.parseAll(EntityParser.domain,pre)
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