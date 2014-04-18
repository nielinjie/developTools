package com.paic.domain

import java.io.{FileWriter, File, FileReader}
import scala.io.Source
import scala.util.parsing.combinator._

object Main {
  def main(arg:Array[String])={
    val pre=Preprocessor.preProcess(Source.fromFile(new File("./functions.model")).mkString)
    val parsed=Parser.parseAll(Parser.domain,pre)
    println(parsed.map{
      d=>
        Printer.print(d)
        val re=(Rewrite.rewrite(d)).normalize
        Printer.print(re)
        val json=Json.json(re)
        val writer = new FileWriter(new File("./domain.js"))
          writer.write(s"window.domain = ${json}")
        writer.close
    })
  }
}