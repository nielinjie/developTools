package domain

import domain.parse.{Printer, Rewrite, Preprocessor, Parser}
import org.json4s._
import org.json4s.Extraction.decompose
import org.json4s.native.Serialization
import org.json4s.native.Serialization.{read, write}
import com.paic.server.Repository
import java.io.File
import scala.io.{Codec, Source}

import scala.collection.JavaConverters._

object Json {
  def json(domain: Domain): String = {
    implicit val formats = Serialization.formats(NoTypeHints)
    write(domain)
  }

  def toJValue(domain: Domain): JObject = {
    implicit val formats = Serialization.formats(NoTypeHints)
    decompose(domain).asInstanceOf[JObject]
  }
}


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
