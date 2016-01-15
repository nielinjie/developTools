package domain.repository

import java.io.File

import com.paic.server.Repository
import domain.Domain
import domain.parse.{Parser, Preprocessor, Printer, Rewrite}
import org.json4s._

import scala.io.{Codec, Source}




class DomainRepository(val sourceFiles: List[File]) extends Repository {
  def domains:Domain={
    sourceFiles.map{
      case f=>
        domain(f)
    }.reduceLeft(_.merge(_))
  }

  def domain(sourceFile:File): Domain = {
    val pre = Preprocessor.preProcess(Source.fromFile(sourceFile)(Codec("utf-8")).mkString)
    val parsed = Parser.parseAll(Parser.domain, pre)
    parsed.map {
      d =>
        Printer.print(d)
        val re = (Rewrite.rewrite(d)).normalize
        Printer.print(re)
        re
    }.getOrElse(???)
  }

  def query(query: Option[JObject]) = {
    query match {
      case None => List(Json.toJValue(domains))
      case _ => ???
    }
  }

  def add(obj: JObject) = {
    ???
  }

  def clear = {
    ???
  }
}
