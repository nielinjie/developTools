package domain

import java.io.File

import domain.dsl.Message.Level
import domain.dsl.{Message, Builder}
import domain.parse._


object Main {
  val printer = SimplePrinter

  def main(arg: Array[String]) = {
    val path = new File("../entities")
    val context = new Builder(path).build()
    context.domains.foreach(printer.print(_))
    println(Message.dump(context,Level.Info))
  }


}